const express = require("express");
const router = express.Router();
const mysql = require("../mysql"); // 이폴더의 index.js 자동추적
const _ = require("lodash");
const { reviewOutcomeUrl } = require("../mysql/sql");

// 프로젝트 후기
async function getViewCount(reviewList) {
  for (let i = 0; i < reviewList.length; i++) {
    // response : [{id: x, cnt: x}]
    const response = await mysql.query(
      "getProjectViewCount",
      reviewList[i].project_id
    );
    if (response[0] === undefined) {
      reviewList[i].viewCount = 0;
    } else {
      reviewList[i].viewCount = response[0].viewCnt;
    }
  }
}

//GET  내가 현재 시점에서 후기 작성 가능한 프로젝트 리스트를 가져온다.
router.get("/getReviewAvailProjectList", async (req, res) => {
  // const { sessionUserId } = res.sessionUserId;
  const sessionUserId = req.query.userId;
  const reviewAvailProjectList = await mysql.query("ReviewAvailProjectList", [
    sessionUserId,
    sessionUserId,
    sessionUserId
  ]);
  res.send(reviewAvailProjectList);
});
// GET
// router.get("/getUserHistory", async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const userHistory = await mysql.query("getUserHistory", [userId, userId]);
//     userHistory;
//     res.send(userHistory);
//   } catch (error) {
//     res.send(error);
//   }
// });

router.post("/", async (req, res) => {
  try {
    const page = (req.body.param.page - 1) * 8;
    const keyword = `%${req.body.param.keyword}%`;
    const stacks = req.body.param.stacks;
    const stack1 = stacks[0] === undefined ? "%%" : `%${stacks[0]}%`;
    const reviewList = await mysql.query("reviewList", [
      stack1,
      keyword,
      keyword,
      keyword,
      page
    ]);
    const count = await mysql.query("getReviewCount", [
      stack1,
      keyword,
      keyword,
      keyword
    ]);
    await getViewCount(reviewList);
    res.send({ count, reviewList });
  } catch (error) {
    res.send(error);
  }
});
// POST
router.post("/insertReview", async (req, res) => {
  try {
    // req.body.xxxx  xxxx : front에서 작성하는 겁니다. 헷갈리면 계속 콘솔에서 찍어봅시다.
    const reviewVal = req.body.param; // {}
    const response = await mysql.query("reviewInsert", reviewVal);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});
router.post("/insertUrl", async (req, res) => {
  try {
    const urlVal = req.body.param;
    const response = await mysql.query("outcomeUrlInsert", urlVal);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
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

  let writerImage = await mysql.query("getUserImage", [
    reviewDetail[0].writer_id
  ]);

  // 결과물링크
  let reviewOutcomeUrl = await mysql.query("reviewOutcomeUrl", [reviewId]);
  res.send(
    _.merge(reviewDetail[0], writerName[0], reviewOutcomeUrl[0], writerImage[0])
  );
});

// GET
// 유저가 작성한 리뷰 목록
router.get("/history/:userId", async (req, res) => {
  let userId = req.params.userId;
  const reviewHistory = await mysql.query("getUserReviewHistory", [userId]);

  res.send(reviewHistory);
});

module.exports = router;
