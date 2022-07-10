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

  let teamTotalResult = {}; //object 선언
  // 프로젝트 기본정보
  let basicInfo = await mysql.query("getTeamDatas", [req.body.project_id]);
  teamTotalResult.basicInfo = mysql.changeSnake2Camel(basicInfo);

  // 프로젝트 관련링크정보
  let refUrls = await mysql.query("getTeamRefUrls", [req.body.project_id]);
  teamTotalResult.refUrls = mysql.changeSnake2Camel(refUrls);
  // 프로젝트 지원자정보
  let applicants = await mysql.query("getTeamApplicants", [
    req.body.project_id
  ]);
  teamTotalResult.applicants = mysql.changeSnake2Camel(applicants);
  // 프로젝트 멤버정보들
  let members = await mysql.query("getTeamMembers", [
    req.body.project_id,
    req.body.project_id
  ]);
  teamTotalResult.members = mysql.changeSnake2Camel(members);

  // 프로젝트 멘토링정보
  let mentorings = await mysql.query(
    "getTeamMentoringList",
    [req.body.project_id] //param object 가져오기
  );
  teamTotalResult.mentorings = mysql.changeSnake2Camel(mentorings);
  console.log("------------------------------------------");
  console.log(mentorings);

  res.send(teamTotalResult);
});

//팀개요화면  - 헤딩 projectId 의 지원자정보 가져오기 ( 미승인지원자들 우선 가져오도록 query에서 조정 )
router.get("/getTeamApplicants/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const teamApplicantsList = await mysql.query("getTeamApplicants", project_id);
  res.send(teamApplicantsList);
});
// 현재 등록된 팀인원 카드리스트
router.get("/getTeamMemberInfo/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const teamMemberList = await mysql.query("getTeamMemberInfo", project_id);
  res.send(teamMemberList);
});
// 현재 팀 연결된 멘토링카드들 가져옴 ( page 도 받아야함.)
router.get("/getTeamMentoringList", async (req, res) => {
  console.log("==============================111111111111111");
  console.log(req);
  console.log("==============================222222222222222");
  console.log(req.body.param);
  const params = [req.body.param.project_id, req.body.param.mentoring_page];
  const mentoringList = await mysql.query(
    "getTeamMentoringList",
    params //param 가져오기
  );
  res.send(mentoringList);
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
