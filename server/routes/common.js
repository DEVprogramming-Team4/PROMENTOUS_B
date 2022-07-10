const express = require("express");
const mysql = require("../mysql");
const _ = require("lodash");
const router = express.Router();

/****************************/
/* common       공통sql      */
/****************************/
router.get("/deptList", async (req, res) => {
  const deptList = await mysql.query("common_deptList"); //  함수정의시 키워드 async에 대응한 await 필수
  res.send(deptList);
});
router.get("/stackList", async (req, res) => {
  const stackList = await mysql.query("common_stackList");
  res.send(stackList);
});

router.get("/mainArea", async (req, res) => {
  const common_mainArea = await mysql.query("common_mainArea");
  res.send(common_mainArea);
});
router.get("/subArea/:attribute1", async (req, res) => {
  const { attribute1 } = req.params;
  console.log("req.params=================>");
  console.log(req.params);
  const common_subArea = await mysql.query("common_subArea", attribute1);
  res.send(common_subArea);
});

///common/getTeamStatusList // 팀개요화면만을 위한 것으로, change2Camel 적용됨.
router.get("/getTeamStatusList", async (req, res) => {
  const statusList = await mysql.query("common_statusList");
  res.send(mysql.changeSnake2Camel(statusList));
});

module.exports = router; // NECCESARY END STATE
