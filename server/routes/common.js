const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

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

module.exports = router; // NECCESARY END STATE
