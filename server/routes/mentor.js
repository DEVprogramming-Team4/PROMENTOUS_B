const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const _ = require("lodash");

/****
 * FOR MENTORINFO   +   MENTORING
 *
 */
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
