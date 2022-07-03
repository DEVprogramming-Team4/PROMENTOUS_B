const express = require("express");
const session = require("express-session");
const cors = require("cors");
const app = express();
const port = 3000; // 서버 포트 번호 (동적설정)
//console.log(app.get("env"));
require("dotenv").config({ path: `mysql/.env.${app.get("env")}` });
//console.log(process.env);
const mysql = require("./mysql"); // 이폴더의 index.js 자동추적

app.use(
  express.json({
    limit: "50mb" // 최대 50메가
  })
); // 클라이언트 요청 body를 json으로 파싱 처리

let sess = {
  secret: "secret key",
  resave: false, // 세션에 변경사항이 없어도 항상 다시 저장할지 여부
  saveUninitialized: true, // 초기화되지 않은 세션을 저장소에 강제로 저장할지 여부
  cookie: {
    httpOnly: true, // document.cookie 해도 쿠키 정보를 볼 수 없음
    secure: false, // https
    maxAge: 1000 * 60 * 60 // 쿠키가 유지되는 시간
  },
  userId: ""
};

app.use(session(sess));

const corsOptions = {
  origin: "http://localhost:8080", // 허용할 도메인 설정
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const manageRoute = require("./routes/manage");
const commonRoute = require("./routes/common");
const projectRoute = require("./routes/project"); // 프로젝트 모집 관련입니다.
const reviewRoute = require("./routes/review"); // 프로젝트 후기 관련입니다.

app.use(cors(corsOptions));

app.use("/manage", manageRoute); // 이 두줄 set덕분에  routes/manage.js 에서는 1만 써도 데이터 당겨옴.
app.use("/common", commonRoute); // 이 두줄 set덕분에  routes/common.js 에서는 1만 써도 데이터 당겨옴.
app.use("/project/recruit", projectRoute);
app.use("/project/review", reviewRoute);

/****************************/
/* common       공통sql      */
/****************************/
app.get("/common/deptList", async (req, res) => {
  const deptList = await mysql.query("common_deptList"); //  함수정의시 키워드 async에 대응한 await 필수
  res.send(deptList);
});
app.get("/common/stackList", async (req, res) => {
  const stackList = await mysql.query("common_stackList");
  res.send(stackList);
});

/****************************/
/* project     프로젝트 메뉴  */
/****************************/
// projectId 기준 분야별 지원자 / 승인된 자 숫자 가져오기
app.get("/project/applicantsPerDept", async (req, res) => {
  console.log("req==>" + req);
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

app.listen(port, () => {
  console.log(`서버가 포트 ${port}번으로 시작되었습니다.`);
});
