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
/********************************************************************** */
/**************** 01. 공통  METHOD 및 공통  CODE MAP       ***************** */
/********************************************************************** */
/********************************************************************** */
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
  /* 추가 필요 */
};
/* getConnection :  APPJS 기본 MYSQL INIT  */
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
/* changeSnake2Camel :   DB에서 날것인 SNAKE를  FRONT에 보내기전에 CAMEL 화 한다 
   OBJECT 속 OBJECT /배열 이라면.. 
   changeCamel2Snake  를  하위 OBJECT 에도 수행 해줘야 함!! */
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
    //console.log("AFTER  CAMEL....");
    //console.log(temp);
    return temp;
  }
}
/* changeCamel2Snake :  FRONT에서  CAMEL 로 데이터 던져주는경우에 CAMEL 화 한다 
   OBJECT 속 OBJECT /배열 이라면.. 
   changeCamel2Snake  를  하위 OBJECT 에도 수행 해줘야 함!!   */
function changeCamel2Snake(object) {
  if (Object.keys(object).length < 2) {
    // single 결과값인경우
    let newObject = _.mapKeys(object[0], (value, key) => {
      return _.snakeCase(key);
    });
    return newObject;
  } else {
    // multiple 결과값인경우
    newObject = {};
    temp = [];
    for (let index = 0; index < Object.keys(object).length; index++) {
      temp.push(
        _.mapKeys(object[index], (value, key) => {
          return _.snakeCase(key);
        })
      );
    }
    //console.log("AFTER  SNAKE....");
    //console.log(temp);
    return temp;
  }
}
/* change DB  */

/********************************************************************** */
/*******************          02.  QUERY   METHODS   ***************** */
/********************************************************************** */
/********************************************************************** */
/* 02-1. query   쿼리문을 실행하고 결과를 반환하는 함수 */
const query = async (alias, values) => {
  console.log("PARAMS INTO:=====================");
  console.log(values);
  return new Promise((resolve, reject) =>
    pool.query(sql[alias], values, (error, results) => {
      if (error) {
        // 에러가 발생
        console.log(error);

        reject({ error });
      } else {
        /*  QUERY . */
        //select 문 한정으로  stacks 내지 depts 는 변환한다
        if (sql[alias].includes("select") || sql[alias].includes("SELECT")) {
          console.log("-------------------query result----------");
          //console.log(results);
          //console.log(Object.keys(results));
          //console.log(results[0].stack_code);
          // 추후 함수화 필요....
          // result 요소들 순회한다
          for (let index = 0; index < Object.keys(results).length; index++) {
            if (
              !_.isNull(results[0].like_stack_code) &&
              !_.isEmpty(results[index].like_stack_code)
            ) {
              //not null check
              let likestackKor = "";
              results[index].like_stack_code_origin =
                results[index].like_stack_code;
              likestackArr = _.split(results[index].like_stack_code, ",");
              likestackArr.forEach((element) => {
                likestackKor += `${codes[element]},`;
              });
              //stacksKor 예시  = "자바스크립트,타입스크립트";

              results[index].like_stack_code = likestackKor; //????stackArr 을 던져줘도 프론트가 모름
            }
            if (
              !_.isNull(results[0].like_dept_code) &&
              !_.isEmpty(results[index].like_dept_code)
            ) {
              //not null check
              let deptKor = "";
              results[index].like_dept_code_origin =
                results[index].like_dept_code;
              deptArr = _.split(results[index].like_dept_code, ",");
              deptArr.forEach((element) => {
                deptKor += `${codes[element]},`;
              });
              //deptKor 예시  = "기획,데이터베이스";
              results[index].like_dept_code = deptKor;
            }
            if (
              !_.isNull(results[0].stack_code) &&
              !_.isEmpty(results[index].stack_code)
            ) {
              //not null check
              let stackKor = "";
              results[index].stack_code_origin = results[index].stack_code;
              stackArr = _.split(results[index].stack_code, ",");
              stackArr.forEach((element) => {
                stackKor += `${codes[element]},`;
              });
              //deptKor 예시  = "기획,데이터베이스";
              results[index].stack_code = stackKor;
            }
          }
          // console.log(results);
          // console.log("-------------------query result----------");
        }
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};
/* 02-2. queryDynamic  동적 쿼리 구현 SAMPLE */
const queryDynamic = async (alias, values) => {
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
/* 02-2. getProjectList  동적 쿼리로  모집글 리스트를 가져온다  */
const getProjectList = async (alias, values) => {
  console.log("values:=====================");
  console.log(values);
  let v_alias = alias;
  console.log("v_alias : " + v_alias);

  let sql = `  select t2.user_nickname , t.*
  from project t , user t2
  where t.leader_user = t2.user_id  
  `;
  // values 는 프론트단에서 건너온 배열인데 이것을 체크
  if (values.searchKeyWord != null && values.searchKeyWord != "") {
    sql += ` AND 
             (project_desc like '%${values.searchKeyWord}%'
               OR 
              project_title like '%${values.searchKeyWord}%'  
             ) `;
  }
  if (values.status != null && values.status != "") {
    sql += ` AND status_code = '${values.status}'`;
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
    let arr = stackcodes.split(","); // "J01,C01,D01"
    sql += `(`;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (index == 0) {
        sql += `stack_code like '%${arr[index]}%'`; //      stack_code like '%$J01%
      } else {
        sql += `OR stack_code like '%${arr[index]}%'`; // OR   stack_code like '%$C01%
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

module.exports = {
  changeSnake2Camel,
  changeCamel2Snake,
  query,
  queryDynamic,
  getProjectList,
  queryWithBindings_manage_mentoring,
  getConnection
};
