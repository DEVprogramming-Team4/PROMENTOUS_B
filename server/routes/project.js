const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// localhost:3000/project
// 프로젝트는 모집과 후기 탭이 있습니다. 이를 각각 /recruit, /review로 구분하기로 합니다.

// 프로젝트 모집
// GET
// 가장 기본적인 조회는, 최신모집글 8개를 뿌려주는 것
// SORT가 문제인데,,, 어떤 정렬버튼을 클릭했을때 다시 GET요청을 받습니다. 해당 값에따라 소팅이 되어야 합니다.
router.get("/", async (req, res) => {
  const projectRecruitList = await mysql.query("projectRecruitList");
  res.send(projectRecruitList);
});
// POST
// 모집글 작성 부분입니다.
router.post("/insert", async (req, res) => {
  res.send(req.body);
});
// PUT
router.put("/update", async (req, res) => {
  res.send("/project/recruit/update 라우트 루트");
});
// DELETE
router.delete("/delete", async (req, res) => {
  res.send("/project/recruit/delete 라우트 루트");
});

// 모집글 상세 GET
router.get("/:projectId", async (req, res) => {
  let projectId = req.params.projectId;
  const projectDetail = await mysql.query("projectDetail", [projectId]);
  res.send(projectDetail[0]);
});

module.exports = router; // NECCESARY END STATE
