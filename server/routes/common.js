const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get(
  "/mainArea" /*이게 다 app.js의  manageRoute 님 덕분  */,
  async (req, res) => {
    const common_mainArea = await mysql.query("common_mainArea");
    res.send(common_mainArea);
  }
);
router.get(
  "/subArea" /*이게 다 app.js의  manageRoute 님 덕분  */,
  async (req, res) => {
    const common_subArea = await mysql.query("common_mainArea", mainAreaCode);
    res.send(common_subArea);
  }
);

/****************************/
/* manage  프로젝트관리메뉴  */
/****************************/
// 플젝관리화면의 상단에서 , userId 기준으로 하여서 선택가능한 팀들을 가져옴.
router.get("/babo", async (req, res) => {
  const applicantsPerDept = await mysql.query("manage_HeaderSelect");
  res.send(applicantsPerDept);
});

module.exports = router; // 이게 routes 폴더내의 JS 에서 필수적이다!!

//const stackList = await mysql.query("common_mainArea");  const stackList = await mysql.query("common_subArea", mainAreaCode);
