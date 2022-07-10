const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/get", function (req, res) {
  res.send("댓글 조회 & 댓글 넘겨주는 API");
});

// POST
// 댓글 추가
// 받아야되는 인자: 페이지 유형(review인지,, 모집인지,, )- 그거에 따라 대상 테이블 분기.,
// 작성자 아이디, 댓글 내용, 비밀글 여부, 타겟 댓글 아이디.. - 어디서 달앗냐에 따라.. + 시퀀스?
router.post("/register", async (req, res) => {
  //   console.log(req); // body.pageType, body.projectId 이런식으로 들어옴
  // 인자로 들어오는 pageType에 따라 sql문을 분기해주자.

  let pageType = req.body.pageType;
  let body = req.body;

  let query = "";
  let queryData = [];
  // TODO: lodash 이용해 추후 코드 개선하기
  queryData.push(body.projectId);
  queryData.push(body.writerId);
  queryData.push(body.commentText);
  queryData.push(body.parentId);
  queryData.push(body.targetId);
  queryData.push(body.targetSeq);

  // TODO: (보류) 비밀글 기능

  // 쿼리문 분기처리
  if (pageType === "projectRecruit") {
    query = "registerRecruitComment";
  } else if (pageType === "projectReview") {
    query = "registerReviewComment";
  }
//   console.log(queryData);
  const registerComment = await mysql.query(query, queryData);
//   console.log("성공");

  //   res.send(registerComment);
  // ID받아오기 : https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp

  res.send("댓글이 추가되었습니다,,");
});

router.put("/update", function (req, res) {
  res.send("댓글이 수정되었습니다..");
});

router.delete("/delete", function (req, res) {
  res.send("comment/delete 경로,, 댓글이 삭제되었습니다.");
});

module.exports = router;
