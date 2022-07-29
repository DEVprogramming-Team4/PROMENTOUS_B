const express = require("express");
const mysql = require("../mysql");
const _ = require("lodash");
const { iteratee } = require("lodash");
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
  let teamListParam = [
    user_id,
    user_id,
    user_id,
    user_id,
    user_id,
    user_id,
    user_id
  ];
  //console.log("/getTeamListForManage/:user_id 실행  " + user_id);
  const teamListForManage = await mysql.query(
    "manage_topSelect",
    teamListParam
  );
  /* 자료 1개만 있는 경우를 위한 처리.. */
  if (teamListForManage.length == 1) {
    let temp = [];
    temp.push(mysql.changeSnake2Camel(teamListForManage));
    res.send(temp);
  } else {
    res.send(mysql.changeSnake2Camel(teamListForManage));
  }
});

// 팀 관리화면 곳곳에 뿌려질 기초 팀정보들을 가져옴
/* PARAM : project_id ( ex) 11   ) */
router.get("/getTeamDatas/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const teamDatas = await mysql.query("getTeamDatas", project_id);
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
  const project_id = req.body.project_id;
  const sessionUserId = req.body.sessionUserId;
  let teamTotalResult = {}; //object 선언
  /*프로젝트 기본정보  그냥 project 테이블에서 땡겨옴.*/
  let basicInfo = await mysql.query("getTeamDatas", [req.body.project_id]);
  teamTotalResult.basicInfo = mysql.changeSnake2Camel(basicInfo);

  /*프로젝트 관련링크정보*/
  let refUrls = await mysql.query("getTeamRefUrls", [req.body.project_id]);
  if (refUrls.length == 1) {
    teamTotalResult.refUrls = [mysql.changeSnake2Camel(refUrls)];
  } else {
    teamTotalResult.refUrls = mysql.changeSnake2Camel(refUrls);
  }
  if (refUrls.length == 0) {
    teamTotalResult.refUrls = [];
  }

  /*프로젝트 지원자정보 시작 */
  let applicants = await mysql.query("getTeamApplicants", [project_id]);
  console.log("============================");
  console.log("============================");
  console.log("============================");
  console.log("==========applicants==================");
  console.log("============================");
  console.log("============================");
  console.log(applicants);
  console.log(_.isArray(applicants));
  applicants = mysql.convertCodeToNaturalString(applicants);
  if (applicants.length == 1) {
    teamTotalResult.applicants = [mysql.changeSnake2Camel(applicants)];
  } else {
    teamTotalResult.applicants = mysql.changeSnake2Camel(applicants);
  }

  if (applicants.length == 0) {
    teamTotalResult.applicants = [];
  }

  console.log("============APPPLICANTS!!++++");
  console.log(teamTotalResult.applicants);
  /*프로젝트 지원자정보 끝.  */

  /*프로젝트 멤버정보들   시작 . */
  let members = await mysql.query("getTeamMembers", [
    project_id,
    project_id,
    project_id
  ]);
  members = mysql.convertCodeToNaturalString(members);
  if (members.length == 1) {
    // 1개있으면 배열로 안오는 현상때문에 배열화 처리함..
    teamTotalResult.members = [mysql.changeSnake2Camel(members)];
  } else {
    teamTotalResult.members = mysql.changeSnake2Camel(members);
  }

  if (members.length == 0) {
    teamTotalResult.members = [];
  }

  /*소셜링크가져와서 각각 멤버에 심어주기.*/
  for (let index = 0; index < teamTotalResult.members.length; index++) {
    //console.log("각각 멤버에 심어주기.");
    /* 멤버 소셜 집어넣기 */
    teamTotalResult.members[index].userSocialUrl = await mysql.query(
      "getUserSocialUrls",
      [teamTotalResult.members[index].userId]
    );
    //console.log("teamTotalResult.members[index].userSocialUrl");
    //console.log(teamTotalResult.members[index].userSocialUrl);

    /* 멤버 평가여부 집어넣기 멘토링ID 처럼 고유값이 아님. rate user id 및 project까지 다필요함.  */
    teamTotalResult.members[index].rating = await mysql.query(
      "getMemberRating",
      [
        teamTotalResult.members[index].userId,
        teamTotalResult.members[index].userId,
        sessionUserId /*TODO 1에서 sessionUserId로 변경!! */,
        project_id
      ]
    );
    //console.log(teamTotalResult.members[index].rating);
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

    // if (
    //   teamTotalResult.members[index].likeDeptCode != "" ||
    //   teamTotalResult.members[index].likeDeptCode != null
    // ) {
    //   teamTotalResult.members[index].likeDeptCodeOrigin =
    //     teamTotalResult.members[index].likeDeptCode;
    //   teamTotalResult.members[index].likeDeptCode =
    //     mysql.splitDbCodesWithConvertCode(
    //       teamTotalResult.members[index].likeDeptCodeOrigin
    //     );
    // }
    // if (
    //   teamTotalResult.members[index].likeStackCode != "" ||
    //   teamTotalResult.members[index].likeStackCode != null
    // ) {
    //   teamTotalResult.members[index].likeStackCodeOrigin =
    //     teamTotalResult.members[index].likeStackCode;
    //   teamTotalResult.members[index].likeStackCode =
    //     mysql.splitDbCodesWithConvertCode(
    //       teamTotalResult.members[index].likeStackCodeOrigin
    //     );
    // }
    console.log("멤버 +" + index);
    console.log(teamTotalResult.members[index]);
    /* 멤버 각 역할 집어넣기  */
    //console.log(teamTotalResult.members[index].leaderYn);
    if (_.isEqual("Y", teamTotalResult.members[index].leaderYn)) {
      teamTotalResult.members[index].role = "리더"; // TODO_DONE.리더넣기로 합의함..
    } else {
      console.log([
        project_id, //20
        teamTotalResult.members[index].userId //32
      ]);
      t_role = await mysql.query("getMemberRole", [
        project_id,
        teamTotalResult.members[index].userId
      ]);
      console.log(t_role);
      if (t_role.length == 0) {
        teamTotalResult.members[index].role = "";
      } else {
        teamTotalResult.members[index].role = t_role[0].role;
      }
    }
  }

  // console.log("------------------------------------------");
  // console.log(teamTotalResult.members);

  /*프로젝트 멘토링정보*/
  let mentorings = await mysql.query(
    "getTeamMentoringList",
    [project_id] //param object 가져오기
  );

  if (mentorings.length == 1) {
    teamTotalResult.mentorings = [mysql.changeSnake2Camel(mentorings)];
  } else {
    teamTotalResult.mentorings = mysql.changeSnake2Camel(mentorings);
  }

  if (mentorings.length == 0) {
    teamTotalResult.mentorings = [];
  }
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
  }
  //ALL IN ONE SEND
  console.log("최종 SEND 직전! teamTotalResult-----------------------");
  console.log(teamTotalResult);
  res.send(teamTotalResult);
});

/* 팀개요에서 정보 바꾸고 [저장] 시에 데이터 변경처리하기 */
router.patch("/saveTeamManageInfo/:project_id", async (req, res) => {
  let project_id = req.params.project_id;
  let body = req.body;
  console.log("/saveTeamManageInfo 시작!! ");
  /* project table관련  */
  console.log("====================");
  console.log(body);
  console.log("====================");
  console.log(project_id);
  console.log("====================");
  /*PROJECT TABLE 건드려주기  */
  let result = await mysql.query("updateProject", [body.project, project_id]);
  /*상태 변경 시마다 insert 진행 [TABLE  :  project_status ] */
  result = await mysql.query("insertProjectStatus", [body.project_status]);
  res.send(result);
});
/********************************************************************** */
/********************************************************************** */
/*************       INSERT   / UPDATE 레이팅 관련..                  *** */
/********************************************************************** */
/********************************************************************** */
router.post("/saveMentorRating", async (req, res) => {
  console.log(
    "/*************       INSERT   / UPDATE                ***************** */"
  );
  console.log(req.body);
  console.log(
    "/*************       INSERT   / UPDATE                ***************** */"
  );

  res.send(null);
});

/*questions */
/* 종료날짜 column 필요한게 아닐지..?  */

module.exports = router; // NECCESARY END STATE
