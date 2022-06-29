const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

/****************************/
/* manage  프로젝트관리메뉴  */
/****************************/
// 플젝관리화면의 상단에서 , userId 기준으로 하여서 선택가능한 팀들을 가져옴.
router.get("/getTeamListForManage", async (req, res) => {
  const teamListForManage = await mysql.query("manage_HeaderSelect");
  res.send(teamListForManage);
});

module.exports = router; // NECCESARY END STATE
