const mysql = require("mysql");
const sql = require("./sql");
const _ = require("lodash");
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: process.env.MYSQL_LIMIT
});
// 코드값  강제로 가져오기.
const codes = {
  FE: "프론트엔드",
  BE: "백엔드",
  FS: "풀스택",
  DE: "디자인",
  UU: "UI/UX",
  PL: "기획",
  PM: "PM",
  DB: "데이터베이스",
  AL: "알고리즘,자료구조",
  PB: "퍼블리싱",
  DO: "데브옵스",
  DA: "데이터 사이언스",
  T01: "typescript",
  R01: "react",
  V01: "vue",
  J02: "java",
  G01: "go",
  P01: "python",
  R02: "ruby",
  S01: "swift",
  C01: "C",
  C02: "C++",
  C03: "C#",
  J01: "javascript"
};
function changeSnake2Camel(object) {
  if (Object.keys(object).length < 2) {
    // single 결과값인경우
    let newObject = _.mapKeys(object[0], (value, key) => {
      return _.camelCase(key);
    });
    return newObject;
  } else {
    // multiple 결과값인경우
    newObject = {};
    temp = [];
    for (let index = 0; index < Object.keys(object).length; index++) {
      temp.push(
        _.mapKeys(object[index], (value, key) => {
          return _.camelCase(key);
        })
      );
    }
    // 새로운 object를 넣는것이 아니고, key 명칭만바꾸고 배열에 넣어주는 것 뿐이므로 4줄 삭제한다.
    // newObject = temp.reduce(function (acc, cur, i) {
    //   acc[i] = cur;
    //   return acc;
    // }, {});
    return temp;
  }
}

/* 1. query   쿼리문을 실행하고 결과를 반환하는 함수 */
const query = async (alias, values) => {
  console.log("values:=====================");
  console.log(values);
  return new Promise((resolve, reject) =>
    pool.query(sql[alias], values, (error, results) => {
      if (error) {
        // 에러가 발생
        console.log(error);

        reject({ error });
      } else {
        //select 문 한정으로  stacks 내지 depts 는 변환한다
        if (sql[alias].includes("select")) {
          console.log("-------------------query result----------");
          // 추후 함수화 필요....
          // result 요소들 순회한다
          for (let index = 0; index < Object.keys(results).length; index++) {
            if (!_.isNull(results[0].like_stack_code)) {
              //not null check
              stackArr = _.split(results[index].like_stack_code, ",");
              let stackKor = "";
              stackArr.forEach((element) => {
                stackKor += `${codes[element]},`;
              });
              //stacksKor 예시  = "자바스크립트,타입스크립트";
              console.log(stackKor);
              results[index].like_stack_code = stackKor; //????stackArr 을 던져줘도 프론트가 모름
            }
            if (!_.isNull(results[0].like_dept_code)) {
              //not null check
              deptArr = _.split(results[index].like_dept_code, ",");
              let deptKor = "";
              deptArr.forEach((element) => {
                deptKor += `${codes[element]},`;
              });
              //deptKor 예시  = "기획,데이터베이스";
              results[index].like_dept_code = deptKor;
            }
          }
          console.log(results);
          console.log("-------------------query result----------");
        }
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};

const queryWithBindings = async (alias, values) => {
  console.log("values:=====================");
  console.log(values);
  let v_alias = alias;
  console.log("v_alias : " + v_alias);

  let sql = `   select * from test t1 where  1=1 `;
  if (values.c2 != null && values.c2 != "") {
    sql += ` AND c2 = '${values.c2}'`;
  }
  if (values.c3 != null && values.c3 != "") {
    sql += ` AND c3 = '${values.c2}'`;
  }
  console.log("FULL SQL =============== ");
  console.log(sql);
  console.log("//FULL SQL =============== \n");
  return new Promise((resolve, reject) =>
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.log(error);
        reject({ error });
      } else {
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};

const queryWithBindings2 = async (alias, values) => {
  console.log("values:=====================");
  console.log(values);
  let v_alias = alias;
  console.log("v_alias : " + v_alias);

  let sql = `   select * from project where  1=1 `;
  if (values.progress_method != null && values.progress_method != "") {
    sql += ` AND progress_method = '${values.progress_method}'`;
  }
  if (values.status_code != null && values.status_code != "") {
    sql += ` AND status_code = '${values.status_code}'`;
  }
  if (values.main_area_code != null && values.main_area_code != "") {
    sql += ` AND main_area_code = '${values.main_area_code}'`;
  }
  if (values.sub_area_code != null && values.sub_area_code != "") {
    sql += ` AND sub_area_code = '${values.sub_area_code}'`;
  }
  if (values.stack_code != null && values.stack_code != "") {
    sql += ` AND `;
    // req.body.stack_code 가 어떻게 오느냐에 따라서 다르게 반응.
    // 만약 문자열로 온다면. ex )  "T01,R01"
    let stackcodes = values.stack_code;
    let arr = stackcodes.split(",");
    sql += `(`;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (index == 0) {
        sql += `stack_code like '%${arr[index]}%'`;
      } else {
        sql += `OR stack_code like '%${arr[index]}%'`;
      }
    }
    sql += `)`;
  }

  console.log("FULL SQL =============== ");
  console.log(sql);
  console.log("//FULL SQL =============== \n");
  return new Promise((resolve, reject) =>
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.log(error);
        reject({ error });
      } else {
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};

const queryWithBindings_manage_mentoring = async (alias, values) => {
  console.log("values:=====================");
  console.log(values);
  let v_alias = alias;
  console.log("v_alias : " + v_alias);

  let sql = `   select * from test t1 where  1=1 `;
  if (values.project_id != null && values.project_id != "") {
    sql += ` AND project_id = '${values.project_id}'`;
  }
  if (values.page != null && values.page != "") {
    sql += ` AND limit = '${values.page}'`;
  }
  console.log("FULL SQL =============== ");
  console.log(sql);
  console.log("//FULL SQL =============== \n");
  return new Promise((resolve, reject) =>
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.log(error);
        reject({ error });
      } else {
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};

const getConnection = async () => {
  return new Promise((resolve, reject) =>
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject({ err });
      } else {
        resolve(conn);
      }
    })
  );
};

module.exports = {
  changeSnake2Camel,
  query,
  queryWithBindings,
  queryWithBindings2,
  queryWithBindings_manage_mentoring,
  getConnection
};
