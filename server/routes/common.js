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
router.get("/subArea", async (req, res) => {
  const attribute1 = req.query.main;
  // req.query는 위의 경우, main= 이 상태면 그대로 공백이고, 정의하지 않은걸 끌어오려 하면 그냥 undefined이다
  const common_subArea = await mysql.query("common_subArea", attribute1);
  res.send(common_subArea);
});
///common/getTeamStatusList // 팀개요화면만을 위한 것으로, change2Camel 적용됨.
router.get("/getTeamStatusListForTeamManage", async (req, res) => {
  const statusList = await mysql.query("common_statusList");
  //statusListCamel  =   mysql.changeSnake2Camel(statusList);
  console.log(statusList);
  let temp = [];
  for (let index = 0; index < Object.keys(statusList).length; index++) {
    temp.push(statusList[index].code_data_desc);
  }
  //단순배열전송
  console.log("temp")
  console.log(temp);
  res.send(temp);

  // obejct 배열전송
  //res.send(mysql.changeSnake2Camel(statusList));
});
router.get("/getTeamStatusList", async (req, res) => {
  const statusList = await mysql.query("common_statusList");
  res.send(mysql.statusList);
});

module.exports = router; // NECCESARY END STATE
