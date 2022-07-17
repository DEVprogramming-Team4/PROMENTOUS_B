const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const _ = require("lodash");

router.get("/get", function (req, res) {
  res.send("댓글 조회 & 댓글 넘겨주는 API");
});

// POST
// 댓글 추가
// 받아야되는 인자: 페이지 유형(review인지,, 모집인지,, )- 그거에 따라 대상 테이블 분기.,
// 작성자 아이디, 댓글 내용, 비밀글 여부, 타겟 댓글 아이디.. - 어디서 달앗냐에 따라.. + 시퀀스?
router.post("/register/:project_id", async (req, res) => {
  let projectId = req.params.projectId;
  let body = req.body;
  let query = "";
  let queryData = _.concat(
    projectId,
    body.writerId,
    body.commentText,
    body.parentId,
    body.targetId,
    body.sequence
  );

  // TODO: (보류) 비밀글 기능

  // pageType에 따라 쿼리문 분기처리
  let pageType = body.pageType;
  if (pageType === "projectRecruit") {
    query = "registerRecruitComment";
  } else if (pageType === "projectReview") {
    query = "registerReviewComment";
  }

  const registerComment = await mysql.query(query, queryData);
  res.send("댓글이 추가되었습니다.");
});

router.put("/update", function (req, res) {
  res.send("댓글이 수정되었습니다..");
});

router.delete("/delete", function (req, res) {
  res.send("comment/delete 경로,, 댓글이 삭제되었습니다.");
});

module.exports = router;
