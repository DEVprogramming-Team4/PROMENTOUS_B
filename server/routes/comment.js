const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const _ = require("lodash");

router.get("/recruit/get/:projectId", async (req, res) => {
  let projectId = req.params.projectId;
  let commmentList = await mysql.query("getRecruitCommentList", [projectId]);

  // 작성자 id -> 작성자 Name 반환, 작성자 이미지보내주기
  const len = commmentList.length;
  for (var i = 0; i < len; i++) {
    commmentList[i].writer_nickname = (
      await mysql.query("getUserNickName", [commmentList[i].writer_id])
    )[0].user_nickname;

    commmentList[i].writer_image = (
      await mysql.query("getUserImage", [commmentList[i].writer_id])
    )[0].user_image;
  }

  res.send(commmentList);
});

// POST
// 댓글 추가
// 받아야되는 인자: 페이지 유형(review인지,, 모집인지,, )- 그거에 따라 대상 테이블 분기.,
// 작성자 아이디, 댓글 내용, 비밀글 여부, 타겟 댓글 아이디.. - 어디서 달앗냐에 따라.. + 시퀀스?
router.post("/register/:project_id", async (req, res) => {
  let projectId = req.params.project_id;
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

// 수정
router.patch("/edit/:comment_id", async (req, res) => {
  let commentId = req.params.comment_id;
  let body = req.body;
  let query = "";
  let queryData = _.concat(body.contents, commentId);
  let pageType = body.pageType;

  if (pageType === "projectRecruit") {
    query = "updateRecruitComment";
  } else if (pageType === "projectReview") {
    query = "updateReviewComment";
  }

  const updateComment = await mysql.query(query, queryData);
  res.send("댓글이 수정되었습니다.");
});

// 삭제
router.delete("/delete/:pageType/:commentId", async (req, res) => {
  let commentId = req.params.commentId;
  let pageType = req.params.pageType;

  let query = "";
  if (pageType === "projectRecruit") {
    query = "deleteRecruitComment";
  } else if (pageType === "projectReview") {
    query = "deleteReviewComment";
  }

  const deleteComment = await mysql.query(query, commentId);
  res.send("댓글이 삭제되었습니다.");
});

module.exports = router;
