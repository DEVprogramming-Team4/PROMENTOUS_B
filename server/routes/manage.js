const express = require("express");
const mysql = require("../mysql");
const _ = require("lodash");
const router = express.Router();

const MAIN_CODES = async () => {
  try {
    mysql.query("getMainCodes");
  } catch (error) {
    return error;
  }
};

/****************************/
/* manage  프로젝트관리메뉴  */
/****************************/
// 팀개요화면의 상단에서 , userId 기준으로 하여서 선택가능한 팀들을 가져옴.
/* PARAM : user_id ( ex) 3    ) */
router.get("/getTeamListForManage/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const teamListForManage = await mysql.query("manage_topSelect", [
    user_id,
    user_id,
    user_id,
    user_id,
    user_id,
    user_id,
    user_id
  ]);
  console.log("TESTTESTTESTTESTTEST");
  res.send(mysql.changeSnake2Camel(teamListForManage));
});

// 팀 관리화면 곳곳에 뿌려질 기초 팀정보들을 가져옴
/* PARAM : project_id ( ex) 11   ) */
router.get("/getTeamDatas/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const teamDatas = await mysql.query("getTeamDatas", project_id);
  console.log(teamDatas);
  res.send(_.mapKeys(teamDatas, (value, key) => _.camelCase(key)));
});

// 팀개요화면 팀 소통을위한 팀모임URL을 가져옴.
/* PARAM : project_id ( ex) 3    ) */
router.get("/getTeamCommunicateUrls/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const TeamCommunicateUrls = await mysql.query(
    "getTeamCommunicateUrls",
    project_id
  );
  res.send(TeamCommunicateUrls);
});

// 팀 선택 시  . 팀 정보를 한꺼번에 끌어오는 ALL IN ONE API
router.post("/getProjectInfo", async (req, res) => {
  console.log("req.body ::" + req.body);
  console.log(req.body);
  const project_id = req.body.project_id;
  console.log("req.body.project_id :  " + req.body.project_id);

  let teamTotalResult = {}; //object 선언
  /*프로젝트 기본정보  그냥 project 테이블에서 땡겨옴.*/
  let basicInfo = await mysql.query("getTeamDatas", [req.body.project_id]);
  teamTotalResult.basicInfo = mysql.changeSnake2Camel(basicInfo);

  /*프로젝트 관련링크정보*/
  let refUrls = await mysql.query("getTeamRefUrls", [req.body.project_id]);
  teamTotalResult.refUrls = mysql.changeSnake2Camel(refUrls);
  /*프로젝트 지원자정보*/
  let applicants = await mysql.query("getTeamApplicants", [
    req.body.project_id
  ]);
  teamTotalResult.applicants = mysql.changeSnake2Camel(applicants);
  /*프로젝트 멤버정보들*/
  let members = await mysql.query("getTeamMembers", [
    req.body.project_id,
    req.body.project_id
  ]);
  teamTotalResult.members = mysql.changeSnake2Camel(members);
  /*소셜링크가져와서 각각 멤버에 심어주기.*/
  for (let index = 0; index < teamTotalResult.members.length; index++) {
    /* 멤버 소셜 집어넣기 */
    teamTotalResult.members[index].userSocialUrl = await mysql.query(
      "getUserSocialUrls",
      [teamTotalResult.members[index].userId]
    );
    /* 멤버 평가여부 집어넣기 멘토링ID 처럼 고유값이 아님. rate user id 및 project까지 다필요함.  */
    teamTotalResult.members[index].rating = await mysql.query(
      "getMemberRating",
      [
        teamTotalResult.members[index].userId,
        teamTotalResult.members[index].userId,
        "1" /*TODO 1에서 sessionUserid로 변경!! */,
        req.body.project_id
      ]
    );
    /*만일 rating 없으면..  */
    if (teamTotalResult.members[index].rating.length === 0) {
      tempArr = [];
      tempArr.push({
        score: 0,
        comment: "",
        rated: "no"
      });
      teamTotalResult.members[index].rating = tempArr;
    }
    //console.log("testtttttttttttttttttttttttttt");
    //console.log(teamTotalResult.members[index].rating);
    /* 멤버 각 역할 집어넣기  */
    if (_.isEqual("Y", teamTotalResult.members[index].leaderYn)) {
      teamTotalResult.members[index].role = "리더"; // TODO.리더 아님!!
    } else {
      t_role = await mysql.query("getMemberRole", [
        req.body.project_id,
        teamTotalResult.members[index].userId
      ]);
      teamTotalResult.members[index].role = t_role[0].role;
    }
  }
  // console.log("------------------------------------------");
  // console.log(teamTotalResult.members);

  /*멘토링 페이지 총계 정보 */
  let mentoringTotalPageCount = await mysql.query(
    "getTeamMentoringTotalPage",
    [req.body.project_id] //param object 가져오기
  );
  teamTotalResult.mentoringTotalPageCount = mysql.changeSnake2Camel(
    mentoringTotalPageCount
  );
  /*프로젝트 멘토링정보*/

  let mentorings = await mysql.query(
    "getTeamMentoringList",
    [req.body.project_id] //param object 가져오기
  );
  teamTotalResult.mentorings = mysql.changeSnake2Camel(mentorings);
  //mentorRating: { comment: "a", score: 1, rated: "yes" }            2,  1  4  3
  for (let index = 0; index < teamTotalResult.mentorings.length; index++) {
    obj = await mysql.query("getMentoringInfo", [
      teamTotalResult.mentorings[index].mentoringId,
      teamTotalResult.mentorings[index].mentoringId
    ]);
    teamTotalResult.mentorings[index].mentorRating = obj;
    /*만일 rating 없으면..  */
    if (obj.length === 0) {
      tempArr = [];
      tempArr.push({
        score: 0,
        comment: "",
        rated: "no"
      });
      teamTotalResult.mentorings[index].mentorRating = tempArr;
    }
    //console.log("test");
  }

  //ALL IN ONE SEND
  res.send(teamTotalResult);
});
/* 페이지 선택해 멘토링정보 4단위로 가져오기 */
router.post("/getMentoringsBySelectedPage", async (req, res) => {
  let numberForEachPage = 4; //페이지 당 몇개씩 나오는가
  let mentorings = await mysql.query("getTeamMentoringListBySelectedPage", [
    req.body.project_id,
    (req.body.project_id - 1) * numberForEachPage,
    numberForEachPage
  ]);
  mentorings = mysql.changeSnake2Camel(mentorings);

  res.send(mentorings);
});
/* 팀개요에서 정보 바꾼뒤 저장 시에 데이터 변경처리하기 */
router.post("/saveTeamManageInfo", async (req, res) => {
  console.log("/saveTeamManageInfo");
  /* project table관련  */
  res = await mysql.query("getTeamMentoringListBySelectedPage", [
    req.body.project_id,
    (req.body.project_id - 1) * numberForEachPage,
    numberForEachPage
  ]);

  /* ref_url 테이블 관련 -- 관련 링크..  */
  res = await mysql.query("getTeamMentoringListBySelectedPage", [
    req.body.project_id,
    (req.body.project_id - 1) * numberForEachPage,
    numberForEachPage
  ]);

  res.send(res);
});
/********************************************************************** */
/********************************************************************** */
/*************       INSERT   / UPDATE                ***************** */
/********************************************************************** */
/********************************************************************** */
router.post("/saveMentorRating", async (req, res) => {
  let numberForEachPage = 4; //페이지 당 몇개씩 나오는가
  console.log(
    "/*************       INSERT   / UPDATE                ***************** */"
  );
  console.log(req.body);
  console.log(
    "/*************       INSERT   / UPDATE                ***************** */"
  );

  res.send(null);
});

/* param TESt  */
router.post("/testInsert", async (req, res) => {
  console.log("==============================111111111111111");
  console.log(req);
  console.log("==============================222222222222222");
  console.log(req.body.param);
  const params = [req.body.param.c1, req.body.param.c2, req.body.param.c3];

  console.log(
    "======================================================================================"
  );
  console.log(params);

  const testRes = await mysql.query(
    "testInsert",
    // req.body.param //param 가져오기 //insert into test (c1, c2, c3) values `c1` = 1, `c2` = 'qq', `c3` = 'ww'
    req.body.param //insert into test (c1, c2, c3) values 1
  );
  res.send(testRes);
});
//testMyTeamList
router.get("/testMyTeamList", async (req, res) => {
  const mentoringList = await mysql.query(
    "testMyTeamList"
    //param 가져오기
  );
  res.send(mentoringList);
});

//testGet
router.post("/testGet", async (req, res) => {
  console.log("==============================111111111111111");
  //console.log(req);
  console.log("==============================222222222222222");
  console.log(req.body);
  console.log("==============================3333333333333");
  // array = [2, "a"];
  //console.log(array);
  console.log(
    "======================================================================================"
  );
  //const propertyValues = Object.values(req.body.param);
  const propertyValues = [{ c2: "zz" }, { c2: "xx" }, { limit: [0, 1] }];
  console.log(propertyValues);

  const result = await mysql.query(
    "testGet",
    // req.body.param //param 가져오기 //insert into test (c1, c2, c3) values `c1` = 1, `c2` = 'qq', `c3` = 'ww'
    propertyValues // //insert into test (c1, c2, c3) values 1
  );
  console.log(typeof result);
  console.log(result);
  res.send(result);
});

router.post("/testGet2", async (req, res) => {
  console.log("testGet2==============================111111111111111");
  console.log(
    "RESULT======================================================================"
  );

  const result = await mysql.queryWithBindings2(
    "testGet2",
    req.body // axios 가 보내주는 JSON 형태의 PARAMS들
  );
  console.log(typeof result);
  console.log(result);
  res.send(result);
});

/*questions */
/* 종료날짜 column 필요한게 아닐지..?  */

module.exports = router; // NECCESARY END STATE
