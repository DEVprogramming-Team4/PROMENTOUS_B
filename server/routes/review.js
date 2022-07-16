const express = require("express");
const router = express.Router();
const mysql = require("../mysql"); // 이폴더의 index.js 자동추적
const _ = require("lodash");

// 프로젝트 후기
// GET
router.get("/", async (req, res) => {
  const projectRecruitList = await mysql.query("projectRecruitList");
  res.send(projectRecruitList);
});
// POST
router.post("/insert", async (req, res) => {
  res.send(req.body);
});
// PUT
router.put("/update", async (req, res) => {
  res.send("/project/reivew/update 라우트 루트");
});
// DELETE
router.delete("/delete", async (req, res) => {
  res.send("/project/reivew/delete 라우트 루트");
});

// 후기글 상세 GET
router.get("/:reviewId", async (req, res) => {
  let reviewId = req.params.reviewId;
  let reviewDetail = await mysql.query("reviewDetail", [reviewId]);

  // 작성자 id -> 작성자 Name 반환
  let writerName = await mysql.query("getUserNickName", [
    reviewDetail[0].writer_id
  ]);

  // 결과물링크
  let reviewOutcomeUrl = await mysql.query("reviewOutcomeUrl", [reviewId]);
  res.send(_.merge(reviewDetail[0], writerName[0], reviewOutcomeUrl[0]));
});

module.exports = router;
