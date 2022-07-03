const express = require("express");
const router = express.Router();
const mysql = require("../mysql"); // 이폴더의 index.js 자동추적

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

module.exports = router;
