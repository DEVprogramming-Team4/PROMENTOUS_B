const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mysql = require("../mysql");

// localhost:3000/project/recruit
async function getRestData(projectList) {
  for (let i = 0; i < projectList.length; i++) {
    const viewCntData = await mysql.query(
      "getProjectViewCount",
      projectList[i].project_id
    );
    const totalPeopleData = await mysql.query(
      "getTotalPeople",
      projectList[i].project_id
    );
    const acceptedData = await mysql.query(
      "getAcceptedData",
      projectList[i].project_id
    );
    projectList[i].viewCount =
      viewCntData[0] === undefined ? 0 : viewCntData[0].viewCnt;
    projectList[i].totalPeople =
      totalPeopleData[0] === undefined ? 0 : totalPeopleData[0].totalPeople;
    projectList[i].acceptedCnt =
      acceptedData[0] === undefined ? 0 : acceptedData[0].acceptedCount;
  }
}

// 메인화면에 보내줄 정렬이 필요없는 결과값 보내주기
router.get("/", async (req, res) => {
  const projectListDefault = await mysql.query("projectListDefault");
  await getRestData(projectListDefault);
  res.send(projectListDefault);
});

// 프로젝트 모집
router.post("/", async (req, res) => {
  try {
    console.log(req.body.param);
    const page = (req.body.param.page - 1) * 8;
    const recruitStatus = req.body.param.status;
    const stacks = req.body.param.stacks;
    const mainArea = `%${req.body.param.main_area}%`;
    const restArea = `%${req.body.param.rest_area}%`;
    const keyword = `%${req.body.param.keyword}%`;
    const count = await mysql.query("getProjectCount", [recruitStatus]);
    const stack1 = stacks[0] === undefined ? "%%" : `%${stacks[0]}%`;
    let projectRecruitList = [];
    // ======================================================
    if (req.body.param.main_area === "ON") {
      projectRecruitList = await mysql.query("projectListOnline", [
        recruitStatus,
        stack1,
        "ON",
        page
      ]);
    } else if (req.body.param.main_area === "") {
      projectRecruitList = await mysql.query("projectList", [
        recruitStatus,
        stack1,
        page
      ]);
    } else {
      projectRecruitList = await mysql.query("projectListLargeCity", [
        recruitStatus,
        stack1,
        mainArea,
        page
      ]);
    }
    // ======================================================
    await getRestData(projectRecruitList);
    //console.log(projectRecruitList);
    res.send({ count, projectRecruitList }); // node express에서 숫자는 넘겨줄수 없다!!Buffer, String, object, Boolean, Array만 가능하다
  } catch (error) {
    res.send(error);
  }
});
// POST
// 모집글 작성 부분입니다. localhost:3000/project/recruit/insert
router.post("/insertPost", async (req, res) => {
  try {
    // req.body.xxxx  xxxx : front에서 작성하는 겁니다. 헷갈리면 계속 콘솔에서 찍어봅시다.
    const projectVal = req.body.param; // {}
    const response = await mysql.query("projectInsert", projectVal);
    res.send(response);
    // res.send로 보내줄 정보가 있을지 고민
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.post("/insertAdditional", async (req, res) => {
  try {
    const urlVal = req.body.param[0]; // [[{},{}],[{},{}]]
    for (let i = 0; i < urlVal.length; i++) {
      await mysql.query("urlInsert", urlVal[i]);
    }
    const deptVal = req.body.param[1];
    for (let i = 0; i < deptVal.length; i++) {
      await mysql.query("deptInsert", deptVal[i]);
    }
    res.send("success");
    // res.send로 보내줄 정보가 있을지 고민
  } catch (error) {
    res.send(error);
  }
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
  //console.log("실행---------------------");
  //console.log(projectDetail[0]);
  res.send(projectDetail[0]);
});

// GET
// 리더 기본정보
router.get("/:projectId/leader", async (req, res) => {
  let projectId = req.params.projectId;
  const leaderData = await mysql.query("projectLeaderData", [projectId]);
  const leaderHistory = await mysql.query("leaderHistory", [
    projectId,
    projectId
  ]);
  leaderData[0].leaderHistory = leaderHistory;
  console.log(leaderData[0]); // leaderData 확인해보세요
  res.send(leaderData[0]);
});

// GET
// 리더 프로젝트 진행이력 ( 삭제. leaderData.leaderHistory 에 있음.)
// TODO: 데이터 추가 후 테스트 필요
router.get("/:projectId/leaderhistory", async (req, res) => {
  let projectId = req.params.projectId;
  // TODO: 질문: leaderProjectHistory 쿼리문 -> leaderHistory 이렇게 짜도 되는지.
  res.send(leaderHistory);
});

// GET
// 프로젝트 참고 링크
router.get("/:projectId/ref_url", async (req, res) => {
  let projectId = req.params.projectId;
  const refUrl = await mysql.query("projectRefUrl", [projectId]);
  res.send(refUrl);
});

// GET
// 프로젝트 모집 현황 & 인원
router.get("/:projectId/recruit_data", async (req, res) => {
  let projectId = req.params.projectId;
  // apply_dept_id 별로 값을 가짐.
  const recruitData = await mysql.query("projectRecruitData", [projectId]);
  // 각 배열을 순회하면서 apply_dept_id  기준으로 몇명 ACC 되었는지 값을 가져옴. (팀장 포함? 미포함? )
  //console.log(" recruitData 확인해보세요");
  //console.log(recruitData);
  res.send(recruitData);
});

router.get("/:projectId/currentMembers", async (req, res) => {
  let projectId = req.params.projectId;
  // apply_dept_id 별로 값을 가짐.
  const currentMembers = await mysql.query("getCurrentMembers", [projectId]);
  // 각 배열을 순회하면서 apply_dept_id  기준으로 몇명 ACC 되었는지 값을 가져옴. (팀장 포함? 미포함? )
  //console.log(" currentMembers 확인해보세요");
  //console.log(currentMembers);
  sendData = {};
  deptIdArray = [];
  for (let index = 0; index < currentMembers.length; index++) {
    const element = currentMembers[index];

    if (_.indexOf(deptIdArray, element.apply_dept_code) == -1) {
      //console.log("없다. 추가");
      deptIdArray.push(element.apply_dept_code);
      sendData[element.apply_dept_code] = []; // 배열 생성 및 object 투입
      sendData[element.apply_dept_code].push(element);
    } else {
      //console.log("있다. skip ");
      sendData[element.apply_dept_code].push(element);
    }
    //console.log("loop : deptIdArray");
    //console.log(deptIdArray);
  }
  //console.log(" sendData 확인해보세요");
  //console.log(sendData);
  res.send(sendData);
});

// GET
// 후기 모아보기
router.get("/:projectId/all_review", async (req, res) => {
  let projectId = req.params.projectId;
  const allReview = await mysql.query("getAllReview", [projectId]);
  res.send(allReview);
});

module.exports = router; // NECCESARY END STATE
