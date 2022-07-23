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

/***** FOR MENTORINFO   +   MENTORING *****/
router.get("/", async (req, res) => {
  const mentorList = await mysql.query("mentorListDefault"); // [{}, ... , {}]
  // const mentorID = await mysql.query("mentorID");
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

/* 페이지 선택해 멘토링정보 4단위로 가져오기 */
router.post("/getMentorList", async (req, res) => {
  
  let numberForEachPage = 6; //페이지 당 몇개씩 나오는가
  let currentPage = 0;
  let mentorList = await mysql.query("mentorListAvail", [
     numberForEachPage, currentPage
  ]); 
  console.log("/getMentorList"); 
  console.log(mentorList)
  for (let index = 0; index < mentorList.length; index++) {
    mentorList[index].RATE =  await mysql.query("getRate", [
      mentorList[index].user_id 
   ]);
   mentorList[index].dept_code = ['javascript','hardServer'];
    console.log (index +"의 RATE ") 
    console.log(mentorList[index].rate
      )
  }
  res.send(mentorList);
}); 
router.post("/getMentorDetail", async (req, res) => {
  console.log("/getMentorDetail 시작"+ req.body.mentorId); 
  let numberForEachPage = 6; //페이지 당 몇개씩 나오는가
  let currentPage = 0;
  let mentorData = {};
  /*멘토기본정보 */
  mentorData.basicInfo = await mysql.query("mentorBasicInfo", [
    req.body.mentorId
  ]); 
  mentorData.reputations  = []  
  let temp = await mysql.query("mentorReputations", [
    req.body.mentorId
  ]);  //mentorReputations  score/comment 만 땡겨온다. 별점 상위순으로 . 
  console.log(temp); 
  for (let index = 0; index < temp.length; index++) {
    const element = { score: temp[index].score , comment :temp[index].comment  } ;
    mentorData.reputations.push(element)
  }
  //console.log(mentorData.reputations)
  //console.log("/getMentorDetail"); 
  
  
  mentorData.mentoringHistory = [];
  temp = await mysql.query("mentorHistory", [
    /*TODO  임시제거하고 2로하드코딩 !! req.body.mentorId*/
    req.body.mentorId
  ]);  //mentorReputations  score/comment 만 땡겨온다. 별점 상위순으로 . 
  
  for (let index = 0; index < temp.length; index++) {
    /* 멘토링이력에 뜨는 프로젝트들의 모집글로 이동할 수 있게   backtick 으로 url 직접제공   */
    let urlForElement = `/project/recruit/${temp[index].project_id}`;
    const element = { href : urlForElement , name :temp[index].title  } ;
    mentorData.mentoringHistory.push(element)
  }
  console.log(mentorData.mentoringHistory); 

  
  res.send(mentorData);
}); 


module.exports = router; // NECCESARY END STATE
