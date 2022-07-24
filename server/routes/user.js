const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
/****
 * FOR LOGIN  + USER INFO
 *
 */
// 유저 단일 정보 가져오기
router.get("/:userId", async (req, res) => {
  let userId = req.params.userId;
  const userDetail = await mysql.query("userDetail", [userId]);
  const mentorRateData = await mysql.query("mentorRate", [userId]);
  userDetail[0].mentorRateCount =
    mentorRateData[0] === undefined ? 0 : mentorRateData[0].cnt;
  userDetail[0].mentorRateAVG =
    mentorRateData[0] === undefined ? 0 : mentorRateData[0].rateAVG;
  const userRateData = await mysql.query("userRate", [userId]);
  userDetail[0].userRateCount =
    userRateData[0] === undefined ? 0 : userRateData[0].cnt;
  userDetail[0].userRateAVG =
    userRateData[0] === undefined ? 0 : userRateData[0].rateAVG;
  //console.log("userDetail return---------------------");
  //console.log(userDetail[0]);
  res.send(userDetail[0]);
});

module.exports = router; // NECCESARY END STATE
