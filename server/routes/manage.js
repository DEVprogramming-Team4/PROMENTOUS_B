const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

/****************************/
/* manage  프로젝트관리메뉴  */
/****************************/
// 팀개요화면의 상단에서 , userId 기준으로 하여서 선택가능한 팀들을 가져옴.
/* PARAM : user_id ( ex) 3    ) */
router.get("/getTeamListForManage/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const teamListForManage = await mysql.query("manage_topSelect", user_id);
  res.send(teamListForManage);
});

// 팀 관리화면 곳곳에 뿌려질 기초 팀정보들을 가져옴
/* PARAM : project_id ( ex) 11   ) */
router.get("/getTeamDatas/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const teamDatas = await mysql.query("getTeamDatas", project_id);
  res.send(teamDatas);
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
//현재 팀과 관계된 멘토링(mentoring) 카드리스트를 위한정보 당겨오기
//getTeamMentoringList
router.get("/getTeamMentoringInfo/:project_id", async (req, res) => {
  const { project_id } = req.params;
  const teamMentoringList = await mysql.query(
    "getTeamMentoringInfo",
    project_id
  );
  res.send(teamMentoringList);
});

/*questions */
/* 종료날짜 column 필요한게 아닐지..?  */

module.exports = router; // NECCESARY END STATE
