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
  프론트엔드: "FE",
  BE: "백엔드",
  백엔드: "BE",
  FS: "풀스택",
  풀스택: "FS",
  DE: "디자인",
  디자인: "DE",
  UU: "UIUX" /*KEY에 UI/UX가 안들어간다.... */,
  UIUX: "UU" /**UIUX !! */,
  PL: "기획",
  기획: "PL",
  PM: "PM",
  DB: "데이터베이스",
  데이터베이스: "DB",
  AL: "알고리즘/자료구조",
  알고리즘: "AL" /**알고리즘!! */,
  PB: "퍼블리싱",
  퍼블리싱: "PB",
  DO: "데브옵스",
  데브옵스: "DO",
  DA: "데이터사이언스",
  데이터사이언스: "DA",
  T01: "typescript",
  typescript: "T01",
  R01: "react",
  react: "R01",
  V01: "vue",
  vue: "V01",
  J02: "java",
  java: "J02",
  G01: "go",
  go: "G01",
  P01: "python",
  python: "P01",
  R02: "ruby",
  ruby: "R02",
  S01: "swift",
  swift: "S01",
  C01: "C",
  C: "C01",
  C02: "C++",
  C__: "C02" /**C__ !! */,
  C03: "C#",
  Csharp: "C03" /**Csharp!! */,
  J01: "javascript"
  /* 추가 필요 */
};
/* CONVERT TO KOR*/
const convertCode = (codeValue) => {
  let keyword = codeValue;
  if (keyword == "UI/UX") keyword = "UIUX";
  if (keyword == "알고리즘/자료구조") keyword = "알고리즘";
  if (keyword == "C++") keyword = "C__";
  if (keyword == "C#") keyword = "Csharp";
  return codes[keyword];
};
/*joinWebCodes - 웹에서 받아온 코드뭉치 배열ARRAY를 재료로 받고, 
   여기 요소들을 코드화하여 join 해서 단일 문자열화 한다.
   TABLE 에 insert / update 할때 사용한다.  */
const joinWebCodes = (webCodeArray) => {
  let arr = [];
  for (let j = 0; j < webCodeArray.length; j++) {
    let element = webCodeArray[j];
    arr.push(convertCode(element));
  }
  return arr.join();
};
/*splitDbCodes -  DB에저장되는 형태 ex ) "J01,C01"
   여기 요소들을 split 하여, 자연어로 된 배열화 한다.
    이때 convertCode 를 활용한다. (WithConvertCode)
   TABLE의 자료를 SELECT할때 사용한다  */
const splitDbCodesWithConvertCode = (dbCodeString) => {
  let arr = [];
  //console.log(dbCodeString);
  if (dbCodeString != "" || dbCodeString != null) {
    let temp = dbCodeString.split(",");

    for (let j = 0; j < temp.length; j++) {
      const element = temp[j];
      //console.log(convertCode(element));
      arr.push(convertCode(element));
    }
  }
  return arr;
};
/* getNewPostId  테이블이름 + 테이블 키값 을 재료로 주면 , 새로이 등록될 
 글의  post id 값을 가져올수 있다.  "신규 등록 글" 이 참고링크가 달려 있는 경우에
  새로이 생성될 놈의 post_id 값을 넣어 주어야 하므로, 이때 사용한다.   */
const getNewPostId = async (tableName, autoIncrementColumn) => {};
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
  //console.log("PARAMS INTO:=====================");
  //console.log(values);
  return new Promise((resolve, reject) =>
    pool.query(sql[alias], values, (error, results) => {
      if (error) {
        // 에러가 발생
        console.log(error);

        reject({ error });
      } else {
        /*  QUERY . */
        //select 문 한정으로  stacks 내지 depts 는 변환한다
        /* 20220730 핫픽스로 전부 삭제!!!!!  */
        // if (sql[alias].includes("select") || sql[alias].includes("SELECT")) {
        //   //console.log("-------------------query result----------");
        //   //console.log(results);
        //   //console.log(Object.keys(results));
        //   //console.log(results[0].stack_code);
        //   // 추후 함수화 필요....
        //   // result 요소들 순회한다
        //   for (let index = 0; index < Object.keys(results).length; index++) {
        //     if (
        //       !_.isNull(results[0].like_stack_code) &&
        //       !_.isEmpty(results[index].like_stack_code)
        //     ) {
        //       //not null check
        //       let likestackKor = "";
        //       results[index].like_stack_code_origin =
        //         results[index].like_stack_code;
        //       likestackArr = _.split(results[index].like_stack_code, ",");
        //       likestackArr.forEach((element) => {
        //         likestackKor += `${codes[element]},`;
        //       });
        //       //stacksKor 예시  = "자바스크립트,타입스크립트";

        //       results[index].like_stack_code = likestackKor; //????stackArr 을 던져줘도 프론트가 모름
        //     }
        //     if (
        //       !_.isNull(results[0].like_dept_code) &&
        //       !_.isEmpty(results[index].like_dept_code)
        //     ) {
        //       //not null check
        //       let deptKor = "";
        //       results[index].like_dept_code_origin =
        //         results[index].like_dept_code;
        //       deptArr = _.split(results[index].like_dept_code, ",");
        //       deptArr.forEach((element) => {
        //         deptKor += `${codes[element]},`;
        //       });
        //       //deptKor 예시  = "기획,데이터베이스";
        //       results[index].like_dept_code = deptKor;
        //     }
        //     if (
        //       !_.isNull(results[0].stack_code) &&
        //       !_.isEmpty(results[index].stack_code)
        //     ) {
        //       //not null check
        //       let stackKor = "";
        //       results[index].stack_code_origin = results[index].stack_code;
        //       stackArr = _.split(results[index].stack_code, ",");
        //       stackArr.forEach((element) => {
        //         stackKor += `${codes[element]},`;
        //       });
        //       //deptKor 예시  = "기획,데이터베이스";
        //       results[index].stack_code = stackKor;
        //     }
        //   }
        //   // console.log(results);
        //   // console.log("-------------------query result----------");
        // }
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};
/* 02-2. queryDynamic  동적 쿼리 구현 SAMPLE */
const queryDynamic = async (alias, values) => {
  //console.log("values:=====================");
  //console.log(values);
  let sql = `   select * from test t1 where  1=1 `;
  if (values.c2 != null && values.c2 != "") {
    sql += ` AND c2 = '${values.c2}'`;
  }
  if (values.c3 != null && values.c3 != "") {
    sql += ` AND c3 = '${values.c2}'`;
  }
  //console.log("FULL SQL =============== ");
  //console.log(sql);
  //console.log("//FULL SQL =============== \n");
  return new Promise((resolve, reject) =>
    pool.query(sql, values, (error, results) => {
      if (error) {
        //console.log(error);
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

/* 02-3 getMentorInfoList  동적 쿼리로  멘토 리스트를 가져온다  */
const getMentorInfoList = async (values) => {
  console.log("values:=====================");
  console.log(values);
  let sql = ` 
  select
  t1.mentor_info_id  
  , t1.mentoring_title 
  ,t1.mentoring_intro
  ,t1.user_id  
  ,fn_getMentorRate(t1.user_id  ) totalRate
  ,fn_getMentorRateCount( t1.user_id )  rateCount
  ,t2.user_nickname
  ,t2.user_image
  ,t2.user_account
  ,t1.mentor_register_date
  ,t1.mentoring_dept_code
  ,fn_board_viewcnt ('MTB', t1.mentor_info_id ) view_count
  from mentor_info t1 , user t2 
 where    t2.user_id = t1.user_id   
  `;
  // values 는 프론트단에서 건너온 배열인데 이것을 체크
  if (values.searchKeyWord != null && values.searchKeyWord != "") {
    sql += ` 
              /*조건1 검색어 */
              and 
              (t1.mentoring_title like '%${values.searchKeyWord}%'
              OR 
              t1.mentoring_intro like '%${values.searchKeyWord}%'
              ) 
             `;
  }
  /*dept_code 는  코드문자열로 들어온다고 전제함. */
  if (values.dept_code != null && values.dept_code != "") {
    sql += ` AND `;
    // req.body.stack_code 가 어떻게 오느냐에 따라서 다르게 반응.
    // 만약 문자열로 온다면. ex )  "T01,R01"
    let deptcodes = values.dept_code;
    let arr = deptcodes.split(","); // "J01,C01,D01"
    sql += `(`;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (index == 0) {
        sql += `t1.mentoring_dept_code  like '%${arr[index]}%'`; //      stack_code like '%$J01%
      } else {
        sql += `OR t1.mentoring_dept_code like '%${arr[index]}%'`; // OR   stack_code like '%$C01%
      }
    }
    sql += `)`;
  }
  // SQL  ORDERBY 영역
  sql += `order by t1.mentor_register_date desc  `;

  // SQL  LIMIT 영역
  let offset = (values.selectedPage - 1) * 8;
  sql += `limit 8 offset ${offset} /* (선택한 페이지-1)  *8 from 0   */`;
  /*SQL끝.  */
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

const getMentorInfoTotalCount = async (values) => {
  console.log("values:=====================");
  console.log(values);
  let sql = ` 
  select
  count(t1.mentor_info_id ) count
  from mentor_info t1 , user t2 
 where    t2.user_id = t1.user_id   
  `;
  // values 는 프론트단에서 건너온 배열인데 이것을 체크
  if (values.searchKeyWord != null && values.searchKeyWord != "") {
    sql += ` 
              /*조건1 검색어 */
              and 
              (t1.mentoring_title like '%${values.searchKeyWord}%'
              OR 
              t1.mentoring_intro like '%${values.searchKeyWord}%'
              ) 
             `;
  }
  /*dept_code 는  코드문자열로 들어온다고 전제함. */
  if (values.dept_code != null && values.dept_code != "") {
    sql += ` AND `;
    // req.body.stack_code 가 어떻게 오느냐에 따라서 다르게 반응.
    // 만약 문자열로 온다면. ex )  "T01,R01"
    let deptcodes = values.dept_code;
    let arr = deptcodes.split(","); // "J01,C01,D01"
    sql += `(`;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (index == 0) {
        sql += `t1.mentoring_dept_code  like '%${arr[index]}%'`; //      stack_code like '%$J01%
      } else {
        sql += `OR t1.mentoring_dept_code like '%${arr[index]}%'`; // OR   stack_code like '%$C01%
      }
    }
    sql += `)`;
  }
  /*SQL끝.  */
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
  convertCode,
  joinWebCodes,
  splitDbCodesWithConvertCode,
  getNewPostId,
  query,
  queryDynamic,
  getProjectList,
  getMentorInfoList,
  getMentorInfoTotalCount,
  getConnection
};
