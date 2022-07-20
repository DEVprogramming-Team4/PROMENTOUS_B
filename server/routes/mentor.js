const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const _ = require("lodash");

async function getRateData(mentorList) {
  for (let i = 0; i < mentorList.length; i++) {
    const response = await mysql.query("mentorRate", mentorList[i].user_id);
    if (response[0] === undefined) {
      mentorList[i].rateCount = 0;
      mentorList[i].rateAVG = 0;
    } else {
      mentorList[i].rateCount = response[0].cnt;
      mentorList[i].rateAVG = response[0].rateAVG;
    }
  }
}

/***** FOR MENTORINFO   +   MENTORING *****/
router.get("/", async (req, res) => {
  const mentorList = await mysql.query("mentorListDefault"); // [{}, ... , {}]
  // const mentorID = await mysql.query("mentorID");
  await getRateData(mentorList);
  res.send(mentorList);
});
/* 페이지 선택해 멘토링정보 4단위로 가져오기 */
router.post("/getMentorInfo", async (req, res) => {
  let numberForEachPage = 4; //페이지 당 몇개씩 나오는가
  let mentorings = await mysql.query("getTeamMentoringListBySelectedPage", [
    req.body.project_id,
    (req.body.project_id - 1) * numberForEachPage,
    numberForEachPage
  ]);
  mentorings = mysql.changeSnake2Camel(mentorings);

  res.send(mentorings);
});

module.exports = router; // NECCESARY END STATE
