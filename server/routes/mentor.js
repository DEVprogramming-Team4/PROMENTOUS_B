const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const _ = require("lodash");

async function getRateData(mentorList) {
  for (let i = 0; i < mentorList.length; i++) {
    const response = await mysql.query("mentorRate", mentorList[i].user_id);
    if (response[0] === undefined) {
      mentorList[i].rateCount = 0;
      mentorList[i].rateAVG = 0;
    } else {
      mentorList[i].rateCount = response[0].cnt;
      mentorList[i].rateAVG = response[0].rateAVG;
    }
  }
}
/**멘토링 카드리스트화면 페이지네이션 **/
router.post("/getMentorInfo", async (req, res) => {
  let numberForEachPage = 8; //페이지 당 몇개씩 나오는가
  let mentorings = await mysql.query("getTeamMentoringListBySelectedPage", [
    req.body.project_id,
    (req.body.project_id - 1) * numberForEachPage,
    numberForEachPage
  ]);
  mentorings = mysql.changeSnake2Camel(mentorings);

  res.send(mentorings);
});

/*멘토링 리스트 페이지네이션 STANDARD  */
router.post("/mentorList",async(req,res)=> {
   let mentorList = await mysql.getMentorInfoList( req.body );
   console.log("/mentorList");
   console.log(mentorList);
   for (let index = 0; index < mentorList.length; index++) {
    mentorList[index].RATE =  await mysql.query("getRate", [
      mentorList[index].user_id 
   ]);
   //console.log (index +"의 RATE ") 
   //console.log (mentorList[index].RATE) 
   console.log("=-=========")
   console.log(mentorList[index].mentoring_dept_code)
   mentorList[index].mentoring_dept_code_origin = mentorList[index].mentoring_dept_code;
   let tempArr = _.split(mentorList[index].mentoring_dept_code,',');
   mentorList[index].mentoring_dept_code = [];
   mentorList[index].dept_code = [];
   for (let j = 0; j < tempArr.length; j++) {
     const element = tempArr[j]; 
     mentorList[index].mentoring_dept_code.push(mysql.convertCode(element));
     mentorList[index].dept_code.push(mysql.convertCode(element));
   }     
  }  
  let count = await mysql.getMentorInfoTotalCount( req.body ); 
   res.send({count ,mentorList});
})



/***** FOR MENTORINFO   +   MENTORING *****/
router.get("/", async (req, res) => {
  const mentorList = await mysql.query("mentorListDefault"); // [{}, ... , {}]
  // const mentorID = await mysql.query("mentorID");
  await getRateData(mentorList);
  res.send(mentorList);
});

/***** FOR MENTORINFO   +   MENTORING *****/
// 메인페이지 6개의 멘토리스트 정보입니다.
router.get("/", async (req, res) => {
  const mentorList = await mysql.query("mentorListDefault");
  await getRateData(mentorList);
  res.send(mentorList);
});

/* 페이지 선택해 멘토링정보 4단위로 가져오기 */
router.post("/getMentorInfo", async (req, res) => {
  let numberForEachPage = 4; //페이지 당 몇개씩 나오는가
  let mentorings = await mysql.query("getTeamMentoringListBySelectedPage", [
    req.body.project_id,
    (req.body.project_id - 1) * numberForEachPage,
    numberForEachPage
  ]);
  mentorings = mysql.changeSnake2Camel(mentorings);

  res.send(mentorings);
});

/*멘토 디테일 가져오기  */
router.post("/getMentorDetail", async (req, res) => {
  console.log("/getMentorDetail 시작" + req.body.mentorId);
  let mentorData = {};
  /*멘토기본정보 */
  mentorData.basicInfo = await mysql.query("mentorBasicInfo", [
    req.body.mentorId
  ]);
  mentorData.reputations = [];
  let temp = await mysql.query("mentorReputations", [req.body.mentorId]); //mentorReputations  score/comment 만 땡겨온다. 별점 상위순으로 .
  //console.log(temp);
  for (let index = 0; index < temp.length; index++) {
    const element = { score: temp[index].score, comment: temp[index].comment };
    mentorData.reputations.push(element);
  }
  //console.log(mentorData.reputations)
  //console.log("/getMentorDetail");
  mentorData.likePart = [];
  console.log("mentorData.basicInfo.mentoring_dept_code");
  mentorData.basicInfo[0].mentoring_dept_code_origin =
    mentorData.basicInfo[0].mentoring_dept_code;
  console.log(mentorData.basicInfo[0].mentoring_dept_code);
  let tempArr = _.split(mentorData.basicInfo[0].mentoring_dept_code, ",");
  for (let index = 0; index < tempArr.length; index++) {
    const element = tempArr[index];
    mentorData.likePart.push(mysql.convertCode(element));
  }
  mentorData.basicInfo[0].mentoring_dept_code = mentorData.likePart;
  console.log(mentorData.likePart);

  /* 멘토링 이력. - 해당 멘토가 멘토링 완료까지달성해낸  프로젝트 모집글링크 안내용 */
  mentorData.mentoringHistory = [];
  temp = await mysql.query("mentorHistory", [
    /*TODO  임시제거하고 2로하드코딩 !! req.body.mentorId*/
    req.body.mentorId
  ]); //mentorReputations  score/comment 만 땡겨온다. 별점 상위순으로 .

  for (let index = 0; index < temp.length; index++) {
    /* 멘토링이력에 뜨는 프로젝트들의 모집글로 이동할 수 있게   backtick 으로 url 직접제공   */
    let urlForElement = `/project/recruit/${temp[index].project_id}`;
    const element = { href: urlForElement, name: temp[index].title };
    mentorData.mentoringHistory.push(element);
  }
  //console.log(mentorData.mentoringHistory); 
  console.log(mentorData.basicInfo[0].mentor_info_id)
  mentorData.url_list = await mysql.query("common_refUrlInfo", [ 
    'MTB' ,mentorData.basicInfo[0].mentor_info_id
  ]);
  res.send(mentorData);
}); 

/* MENTOR EXIST VALIDATION 멘토 등록 화면용  */
//checkMentorInfoExist

router.post("/checkMentorInfoExist", async (req, res) => { 
  let result = await mysql.query("checkMentorInfoExist", [
    req.body.user_id
  ]); 
 console.log("/checkMentorInfoExist")
 console.log(result)
  res.send(result);
});


module.exports = router; // NECCESARY END STATE
