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
    userDetail[0].url_list = [url_list];
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
  d1 = {
    user_nickname: body.nickname,
    user_intro: body.info,
    user_account: body.login,
    //user_image: req.body.param.imageUrl,  // 보강예정!
    //user_mento_authority: "", 이 값은 다른 곳에서 컨트롤 함.멘토 신청 시점에 update 쳐줌!
    like_dept_code: mysql.joinWebCodes(body.parts),
    like_stack_code: mysql.joinWebCodes(body.stacks)
    //user_register_date: "" 이 값도 여기서 다룰 값은 아님.
  };
  console.log("user테이블 저장 어떻게 ??  d1");
  console.log("user테이블 저장 어떻게 ??  d1");
  console.log("user테이블 저장 어떻게 ??  d1");
  console.log(d1);
  /********
   * user TABLE 모양새 
   * user_id 
user_nickname 
user_intro 
user_account 
user_image 
user_mento_authority 
like_dept_code 
like_stack_code 
user_register_date 

   * 
  //let result1 = await mysql.query("updateUserInfo", [d1, userId]);
  // PARAM 가공하여 d2에 넣어주기 - ref_url
  d2 = {};
  /* FLAG 변환없이 .. 기존 내역 일괄 delete 하고 / 새 내용 insert 진행  */
  /* front 에서 동일한가 체크하는 부분은 두지 않고 무조건 delete insert 진행 되는거로 ㄱ  */
  // common_urlDelete: `delete ref_url where post_category =? and post_id =? `,
  // common_urlInsert: `insert into ref_url set ?`,
  // common_urlUpdate: `update ref_url where post_category =? and post_id =? `,
  /* DELETE  */
  //let result1 = await mysql.query("common_urlDelete", ['USB', userId]);
  /* INSERT - FOR문 돌면서 돌아야함.. 
  body.URL_LIST :: DATA구조는 
[
  {
      post_category: "USB",
      post_id: userId,
      url_title: element.title,
      url_address: element.address
  }
]  
형태의 배열 이어야 한다.
  
  
  */
  if (!_.isNull(body.URL_LIST) && !_.isArray(body.URL_LIST))
    console.log("===================================================");
  console.log("===================================================");
  console.log("===========replaceRefUrls=================");
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

module.exports = router; // NECCESARY END STATE
