const express = require("express");
const cors = require("cors");
const app = express();
//console.log(app.get("env"));
require("dotenv").config({ path: `mysql/.env.${app.get("env")}` });
//console.log(process.env);
const mysql = require("./mysql"); // 이폴더의 index.js 자동추적

app.use(
  express.json({
    limit: "50mb", // 최대 50메가
  })
); // 클라이언트 요청 body를 json으로 파싱 처리
const corsOptions = {
  origin: "http://localhost:8080", // 허용할 도메인 설정
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.listen(3000, () => {
  console.log("서버가 포트 3000번으로 시작되었습니다.");
});
/****************************/
/* common       공통sql      */
/****************************/
app.get("/api/common/deptList", async (req, res) => {
  const codeDataList = await mysql.query("common_deptList"); //  함수정의시 키워드 async에 대응한 await 필수
  res.send(codeDataList);
});
app.get("/api/common/stackList", async (req, res) => {
  const codeDataList = await mysql.query("common_stackList");
  res.send(codeDataList);
});

/****************************/
/* project     프로젝트 메뉴  */
/****************************/
// projectId 기준 분야별 지원자 / 승인된 자 숫자 가져오기
app.get("/api/project/applicantsPerDept", async (req, res) => {
  const applicantsPerDept = await mysql.query("applicantsPerDept");
  res.send(applicantsPerDept);
});
/****************************/
/* mentor        멘토링메뉴  */
/****************************/

/****************************/
/* review          후기메뉴  */
/****************************/

/****************************/
/* myPage          마이페이지 */
/****************************/

/****************************/
/* manage  프로젝트관리메뉴  */
/****************************/
// 플젝관리화면의 상단에서 , userId 기준으로 하여서 선택가능한 팀들을 가져옴.
app.get("/api/manage/HeaderSelect", async (req, res) => {
  const applicantsPerDept = await mysql.query("manage_HeaderSelect");
  res.send(applicantsPerDept);
});
