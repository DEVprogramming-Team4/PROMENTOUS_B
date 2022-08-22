const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const _ = require("lodash");
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
  // like dept  / like stack 문자열을  (배열화+convert) 하여 자연어로 WEB에 가져다 줌
  // NULL 처리는  splitDbCodesWithConvertCode내부적으로 되어 있음!!
  userDetail[0].like_stack_code_origin = userDetail[0].like_stack_code;
  userDetail[0].like_stack_code = mysql.splitDbCodesWithConvertCode(
    userDetail[0].like_stack_code_origin
  );
  userDetail[0].like_dept_code_origin = userDetail[0].like_dept_code;
  userDetail[0].like_dept_code = mysql.splitDbCodesWithConvertCode(
    userDetail[0].like_dept_code_origin
  );

  let url_list = await mysql.query("common_getRefUrlInfo", ["USB", userId]);
  //console.log("check... ");
  //console.log(userDetail[0]);
  if (url_list.length == 1) {
    userDetail[0].url_list = url_list;
  } else if (url_list.length > 2) {
    userDetail[0].url_list = url_list;
  } else {
    userDetail[0].url_list = [];
  }
  res.send(userDetail[0]);
});

// 유저 정보 저장 UPDATE 하기  ( $post(`/user/saveData/${this.userId}  )
router.post("/saveData/:userId", async (req, res) => {
  let userId = req.params.userId;
  let body = req.body;
  console.log("post(userId :: " + userId);
  // PARAM 가공하여 d에 넣어주기 - user
  console.log("param 받아올 때의 형태 ");
  console.log(req.body);
  console.log("==============================================");
  if (body.parts.length > 0) {
    let ress = await mysql.query("isCode", [body.parts[0]]);
    if (ress[0].count == 1) {
      body.parts = mysql.justjoin(body.parts);
    } else {
      body.parts = mysql.joinWebCodes(body.parts);
    }
  } else {
    body.parts = "";
  }
  if (body.stacks.length > 0) {
    ress = await mysql.query("isCode", [body.stacks[0]]);
    if (ress[0].count == 1) {
      body.stacks = mysql.justjoin(body.stacks);
    } else {
      body.stacks = mysql.joinWebCodes(body.stacks);
    }
  } else {
    body.stacks = "";
  }

  d1 = {
    user_nickname: body.nickname,
    user_intro: body.info,
    user_account: body.login,
    //user_image: req.body.param.imageUrl,  // 보강예정!
    //user_mento_authority: "", 이 값은 다른 곳에서 컨트롤 함.멘토 신청 시점에 update 쳐줌!
    like_dept_code: body.parts,
    like_stack_code: body.stacks
    //user_register_date: "" 이 값도 여기서 다룰 값은 아님.
  };
  console.log("user테이블 저장 어떻게 ??  d1");
  console.log(d1);

  // 여기 한줄만 살리면  user 테이블  UPDATE 진행 됨!! 주의!!
  let result1 = await mysql.query("updateUserInfo", [d1, userId]);

  if (!_.isNull(body.URL_LIST) && !_.isArray(body.URL_LIST))
    console.log("===================================================");
  console.log("===========replaceRefUrls=========================");
  console.log("===================================================");

  r = await mysql.replaceRefUrls("USB", userId, body.URL_LIST);

  // let param = {
  //   nickname: this.user.nickname,
  //   info: this.user.selfInfo,
  //   score: this.user.score,
  //   scoreCount: this.user.scoreCount,
  //   mentoScore: this.user.mentoScore,
  //   mentoScoreCount: this.user.mentoScoreCount,
  //   login: this.user.googleAccount,
  //   /*selectedPArt ? part 변수명이 뭐가 될지는모르지만.
  // 일단  ['P01', 'V01']
  // 모양새로 ( 스택 / 분야 ) 데이터가 서버에 던져진다고 가정함. */
  //   parts: this.parts,
  //   stacks: this.stacks,
  //   URL_LIST: this.URL_LIST
  // };

  res.send(r);
});

router.get("/rate/:userId", async (req, res) => {
  let userId = req.params.userId;
  let userRate = await mysql.query("getUserRate", userId);
  userRate =
    userRate.length === 0 ? "아직 유저에 대한 평가가 없습니다!" : userRate;
  res.send(userRate);
});

module.exports = router; // NECCESARY END STATE
