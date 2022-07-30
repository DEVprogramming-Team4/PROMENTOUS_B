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
  UU: "UI/UX" /*KEY에 UI/UX가 안들어간다.... */,
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
  J01: "javascript",
  javascript: "J01"
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
const justjoin = (webCodeArray) => {
  let arr = [];
  for (let j = 0; j < webCodeArray.length; j++) {
    let element = webCodeArray[j];
    arr.push(element);
  }
  return arr.join();
};
/*splitDbCodes -  DB에저장되는 형태 ex ) "J01,C01"
   여기 요소들을 split 하여, 자연어로 된 배열화 한다.
    이때 convertCode 를 활용한다. (WithConvertCode)
   TABLE의 자료를 SELECT할때 사용한다  */
const splitDbCodesWithConvertCode = (dbCodeString) => {
  let arr = [];
  console.log(dbCodeString);
  if (dbCodeString != "" && !_.isNull(dbCodeString)) {
    let temp = dbCodeString.split(",");

    for (let j = 0; j < temp.length; j++) {
      const element = temp[j];
      //console.log(convertCode(element));
      arr.push(convertCode(element));
    }
  }
  return arr;
};

/* 선택적으로 사용됨!!!! query 의 결과물 중 like_dept_code . like_stack_code 있는 경우 
  FOR LOOP 돌면서 각 요소요소를 splitDbCodesWithConvertCode 처리 해주는 공통 영역 메서드!!   */
const splitDbCodesWithLoop = (query_result) => {
  console.log("splitDbCodesWithLoop");
  console.log("splitDbCodesWithLoop");
  console.log(_.isArray(query_result));
  console.log("TRUE 여부");
  console.log(query_result);
  if (_.isArray(query_result)) {
    console.log("배열이다.");
    console.log(query_result.length);
  } else {
    console.log("배열아님다.");
  }
  return query_result;
};

const convertCodeToNaturalArray = (queryResult) => {
  // console.log("convertCodeToNaturalString");
  // console.log(queryResult);
  // console.log("조건에 맞는가? ");

  console.log(queryResult.length > 0);
  if (queryResult.length > 0) {
    for (let index = 0; index < queryResult.length; index++) {
      let element = queryResult[index];
      console.log("1차 LOOP ELEMENT ");
      console.log(element);
      if (!_.isNull(element.stack_code) && !_.isUndefined(element.stack_code)) {
        console.log("element.stack_code");
        queryResult[index].stack_code_origin = queryResult[index].stack_code;
        queryResult[index].stack_code = convertCommaCodeStringToNaturalArray(
          element.stack_code
        );
      }

      if (
        !_.isNull(element.like_stack_code) &&
        !_.isUndefined(element.like_stack_code)
      ) {
        queryResult[index].like_stack_code_origin =
          queryResult[index].like_stack_code;
        queryResult[index].like_stack_code =
          convertCommaCodeStringToNaturalArray(
            queryResult[index].like_stack_code
          );
      }

      if (
        !_.isNull(element.like_dept_code) &&
        !_.isUndefined(element.like_dept_code)
      ) {
        queryResult[index].like_dept_code_origin =
          queryResult[index].like_dept_code;
        queryResult[index].like_dept_code =
          convertCommaCodeStringToNaturalArray(
            queryResult[index].like_dept_code
          );
      }
      //mentoring_dept_code
      if (
        !_.isNull(queryResult[index].mentoring_dept_code) &&
        !_.isUndefined(queryResult[index].mentoring_dept_code)
      ) {
        queryResult[index].mentoring_dept_code_origin =
          queryResult[index].mentoring_dept_code;
        queryResult[index].mentoring_dept_code =
          convertCommaCodeStringToNaturalArray(
            queryResult[index].mentoring_dept_code
          );
      }
    }
  } else {
    console.log(
      "============================================================일단 ELSE 탐. "
    );
    console.log("왜 ELSE인지.. 모양확인 ");
    console.log(queryResult.length);
    console.log("왜 ELSE인지.. 모양확인 ");
    console.log(queryResult);
    console.log("왜 ELSE인지.. 모양확인 끄으으으으으읕 ");
    console.log("check1111");
    console.log(
      !_.isNull(queryResult.stack_code) &&
        !_.isUndefined(queryResult.stack_code)
    );
    if (
      !_.isNull(queryResult.stack_code) &&
      !_.isUndefined(queryResult.stack_code)
    ) {
      console.log("element.stack_code");
      queryResult.stack_code_origin = queryResult.stack_code;
      queryResult.stack_code = convertCommaCodeStringToNaturalArray(
        queryResult.stack_code
      );
    }
    console.log("check22222");
    if (
      !_.isNull(queryResult.like_stack_code) &&
      !_.isUndefined(queryResult.like_stack_code)
    ) {
      queryResult.like_stack_code_origin = queryResult.like_stack_code;
      queryResult.like_stack_code = convertCommaCodeStringToNaturalArray(
        queryResult.like_stack_code
      );
    }
    console.log("check3333");
    console.log(
      !_.isNull(queryResult.like_dept_code) &&
        !_.isUndefined(queryResult.like_dept_code)
    );

    if (
      !_.isNull(queryResult.like_dept_code) &&
      !_.isUndefined(queryResult.like_dept_code)
    ) {
      queryResult.like_dept_code_origin = queryResult.like_dept_code;
      queryResult.like_dept_code = convertCommaCodeStringToNaturalArray(
        queryResult.like_dept_code
      );
    }
    //mentoring_dept_code
    if (
      !_.isNull(queryResult.mentoring_dept_code) &&
      !_.isUndefined(queryResult.mentoring_dept_code)
    ) {
      queryResult.mentoring_dept_code_origin = queryResult.mentoring_dept_code;
      queryResult.mentoring_dept_code = convertCommaCodeStringToNaturalArray(
        queryResult.mentoring_dept_code
      );
    }
  }
  //console.log("convertCodeToNaturalString ㄲㄲㄲㄲㄲ");
  //console.log(queryResult);
  return queryResult;
};

const convertCommaCodeStringToNaturalArray = (commaCodeString) => {
  console.log("convertCommaCodeStringToNaturalArray");
  //console.log("convertCommaCodeStringToNatural 에 뭐가들어왔길래?????");
  //console.log(commaCodeString);
  let arr = commaCodeString.split(",");
  let resArr = [];
  let resultString = "";
  console.log(arr);
  if (arr.length > 0) {
    arr.forEach((element) => {
      //console.log("==================자연어  처리 진행");
      resArr.push(convertCode(element));
      // console.log("2");
    });
  } else {
    //console.log("==================자연어  처리 미진행");
  }

  return resArr;
};

/**
 *
 * @param {*} queryResult  query 함수의 결과값을 parameter로 삼는다. (보통은 배열)
 * @returns  query 함수 결과값에서,  stack_code / like_dept_code  / like_stack_code 가 있다면, 이것을  자연어 문자열로 바꿔치기한 상태로 return한다.
 */
const convertCodeToNaturalString = (queryResult) => {
  // console.log("convertCodeToNaturalString");
  // console.log(queryResult);
  // console.log("조건에 맞는가? ");

  console.log(queryResult.length > 0);
  if (queryResult.length > 0) {
    for (let index = 0; index < queryResult.length; index++) {
      console.log("1차 LOOP ELEMENT ");
      console.log(queryResult[index]);
      if (
        !_.isNull(queryResult[index].stack_code) &&
        !_.isUndefined(queryResult[index].stack_code)
      ) {
        console.log("element.stack_code");
        queryResult[index].stack_code_origin = queryResult[index].stack_code;
        queryResult[index].stack_code = convertCommaCodeStringToNatural(
          queryResult[index].stack_code
        );
      }

      if (
        !_.isNull(queryResult[index].like_stack_code) &&
        !_.isUndefined(queryResult[index].like_stack_code)
      ) {
        queryResult[index].like_stack_code_origin =
          queryResult[index].like_stack_code;
        queryResult[index].like_stack_code = convertCommaCodeStringToNatural(
          queryResult[index].like_stack_code
        );
      }

      if (
        !_.isNull(queryResult[index].like_dept_code) &&
        !_.isUndefined(queryResult[index].like_dept_code)
      ) {
        queryResult[index].like_dept_code_origin =
          queryResult[index].like_dept_code;
        queryResult[index].like_dept_code = convertCommaCodeStringToNatural(
          queryResult[index].like_dept_code
        );
      }
      console.log("queryResult[index].like_dept_code");
      console.log(queryResult[index].like_dept_code);
      //mentoring_dept_code
      if (
        !_.isNull(queryResult[index].mentoring_dept_code) &&
        !_.isUndefined(queryResult[index].mentoring_dept_code)
      ) {
        queryResult[index].mentoring_dept_code_origin =
          queryResult[index].mentoring_dept_code;
        queryResult[index].mentoring_dept_code =
          convertCommaCodeStringToNatural(
            queryResult[index].mentoring_dept_code
          );
      }
    }
  } else {
    console.log(
      "============================================================일단 ELSE 탐. "
    );
    console.log("왜 ELSE인지.. 모양확인 ");
    console.log(queryResult.length);
    console.log("왜 ELSE인지.. 모양확인 ");
    console.log(queryResult);
    console.log("왜 ELSE인지.. 모양확인 끄으으으으으읕 ");
    console.log("check1111");
    console.log(
      !_.isNull(queryResult.stack_code) &&
        !_.isUndefined(queryResult.stack_code)
    );
    if (
      !_.isNull(queryResult.stack_code) &&
      !_.isUndefined(queryResult.stack_code)
    ) {
      console.log("element.stack_code");
      queryResult.stack_code_origin = queryResult.stack_code;
      queryResult.stack_code = convertCommaCodeStringToNatural(
        queryResult.stack_code
      );
    }
    console.log("check22222");
    if (
      !_.isNull(queryResult.like_stack_code) &&
      !_.isUndefined(queryResult.like_stack_code)
    ) {
      queryResult.like_stack_code_origin = queryResult.like_stack_code;
      queryResult.like_stack_code = convertCommaCodeStringToNatural(
        queryResult.like_stack_code
      );
    }
    console.log(queryResult.like_stack_code);
    console.log("check3333");
    console.log(
      !_.isNull(queryResult.like_dept_code) &&
        !_.isUndefined(queryResult.like_dept_code)
    );

    if (
      !_.isNull(queryResult.like_dept_code) &&
      !_.isUndefined(queryResult.like_dept_code)
    ) {
      queryResult.like_dept_code_origin = queryResult.like_dept_code;
      queryResult.like_dept_code = convertCommaCodeStringToNatural(
        queryResult.like_dept_code
      );
    }
    //mentoring_dept_code
    if (
      !_.isNull(queryResult.mentoring_dept_code) &&
      !_.isUndefined(queryResult.mentoring_dept_code)
    ) {
      queryResult.mentoring_dept_code_origin = queryResult.mentoring_dept_code;
      queryResult.mentoring_dept_code = convertCommaCodeStringToNatural(
        queryResult.mentoring_dept_code
      );
    }
  }
  //console.log("convertCodeToNaturalString ㄲㄲㄲㄲㄲ");
  //console.log(queryResult);
  return queryResult;
};
const convertCommaCodeStringToNatural = (commaCodeString) => {
  console.log("convertCommaCodeStringToNatural 에 뭐가들어왔길래.");
  console.log(commaCodeString);
  let arr = commaCodeString.split(",");
  let resArr = [];
  let resultString = "";
  console.log(arr);
  if (arr.length > 0) {
    arr.forEach((element) => {
      //console.log("==================자연어  처리 진행");
      resArr.push(convertCode(element));
      // console.log("2");
    });
  } else {
    //console.log("==================자연어  처리 미진행");
  }

  return resArr.join();
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
        // console.log("query ========================");
        //console.log("방금 호출된 query alias========================");
        //console.log("/sql/" + alias);
        //console.log("query alias========================");
        // console.log(results);
        // console.log("query ========================");
        // console.log("query ========================");
        resolve(results);
      } // 쿼리 결과를 전달
    })
  );
};
/* 02-2. REF URL -DB에저장 때마다 전부 delte 치고 .새로 입력하는 로직임  */
/**
 * 
 * @param {*} category -  첫번째 매개변수 --  type ::   USB유저소셜참조링크  / RCB 모집용 참조링크 /  MTB멘토info 용 참조링크 / RVB 후기용 참조링크 
 * @param {*} id - 두번째 매개변수 -- target_id ::  USB -  userID (user테이블 )  /  RCB - project_id (project테이블 )
                 / MTB mentor_info_id ( mentor_info테이블)  /  RVB  review_id ( review 테이블) 
 * @param {*} urlArray  -  세번째 매개변수 --  배열 속에  title , address  있는 object들 들어있으면 됨. 
                          [
                            { title: '데모 프로젝트1 ', address: 'www.naver.com' },
                            { title: '참조 링크 2 ', address: 'www.tesla.com' }
                          ]
 * @returns 
 */
const replaceRefUrls = async (category, id, urlArray) => {
  //alias, values
  return new Promise((resolve, reject) => {
    // delete 수행 .
    let res;
    pool.query(sql[`common_urlDelete`], [category, id], (error, results) => {
      if (error) {
        // 에러가 발생
        console.log(error);
      } else {
        // console.log("query ========================");
        //console.log("방금 호출된 query ============");
        //console.log(sql[`common_urlDelete`]);

        urlArray.forEach(
          (element) => {
            // FOR 문 돌면서 INSERT 수행
            let temp = {
              url_title: element.title,
              url_address: element.address,
              post_category: category,
              post_id: id
            };
            pool.query(sql[`common_urlInsert`], temp, (error, results) => {
              if (error) {
                // 에러가 발생
                console.log(error);
                reject({ error });
              } else {
                // console.log("query ========================");
                //console.log("방금 호출된 query ==========");
                //console.log(sql[`common_urlInsert`]);
              } // 쿼리 결과를 전달
            });
          } // 쿼리 결과를 전달
        );
      }
      res = results;
    });

    resolve(res);
  });
};

// pool.query();
// 들어오는 데이터 예시!!
// [
// {
//   post_category: 'USB',
//   post_id: '22',
//   url_title: 'rrrrr',
// } ,
// {
//   post_category: 'USB',
//   post_id: '22',
//   url_title: 'qwe',
//   url_address: '123'
// }
// ]
// let result1 = await mysql.query("common_urlDelete", ["USB", userId]);
// //SQL 진행. INSERT 당연히 빈 배열이면 스킵되는 로직.
// body.URL_LIST.forEach((element) => {
//   let eachUrlData = {
//     post_category: "USB",
//     post_id: userId,
//     url_title: element.title,
//     url_address: element.address
//   };
//   console.log("eachUrlData EACH 입력건");
//   console.log(eachUrlData);
//   let result2 = mysql.query("common_urlInsert", eachUrlData);
// });})
//////////////
// pool.query(sql[alias], values, (error, results) => {
//   if (error) {
//     // 에러가 발생
//     console.log(error);
//     reject({ error });
//   } else {
//     // console.log("query ========================");
//     console.log("방금 호출된 query alias========================");
//     console.log("/sql/" + alias);
//     //console.log("query alias========================");
//     // console.log(results);
//     // console.log("query ========================");
//     // console.log("query ========================");
//     resolve(results);
//   } // 쿼리 결과를 전달
// })

/* 02-3. queryDynamic  동적 쿼리 구현 SAMPLE */
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

/*========================================================================================*/
/*멘토리스트 화면 페이징을 위한 dynamic query  getMentorInfoList /  getMentorInfoTotalCount */
/*========================================================================================*/
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
/*========================================================================================*/
/* 02-2. getProjectList  동적 쿼리로  모집글 리스트를 가져온다 -사용하지 않아서 비활성 처리하고 아래로 내림.  */
/*========================================================================================*/
// const getProjectList = async (alias, values) => {
//   console.log("values:=====================");
//   console.log(values);
//   let v_alias = alias;
//   console.log("v_alias : " + v_alias);

//   let sql = `  select t2.user_nickname , t.*
//   from project t , user t2
//   where t.leader_user = t2.user_id
//   `;
//   // values 는 프론트단에서 건너온 배열인데 이것을 체크
//   if (values.searchKeyWord != null && values.searchKeyWord != "") {
//     sql += ` AND
//              (project_desc like '%${values.searchKeyWord}%'
//                OR
//               project_title like '%${values.searchKeyWord}%'
//              ) `;
//   }
//   if (values.status != null && values.status != "") {
//     sql += ` AND status_code = '${values.status}'`;
//   }
//   if (values.main_area_code != null && values.main_area_code != "") {
//     sql += ` AND main_area_code = '${values.main_area_code}'`;
//   }
//   if (values.sub_area_code != null && values.sub_area_code != "") {
//     sql += ` AND sub_area_code = '${values.sub_area_code}'`;
//   }
//   if (values.stack_code != null && values.stack_code != "") {
//     sql += ` AND `;
//     // req.body.stack_code 가 어떻게 오느냐에 따라서 다르게 반응.
//     // 만약 문자열로 온다면. ex )  "T01,R01"
//     let stackcodes = values.stack_code;
//     let arr = stackcodes.split(","); // "J01,C01,D01"
//     sql += `(`;
//     for (let index = 0; index < arr.length; index++) {
//       const element = arr[index];
//       if (index == 0) {
//         sql += `stack_code like '%${arr[index]}%'`; //      stack_code like '%$J01%
//       } else {
//         sql += `OR stack_code like '%${arr[index]}%'`; // OR   stack_code like '%$C01%
//       }
//     }
//     sql += `)`;
//   }

//   console.log("FULL SQL =============== ");
//   console.log(sql);
//   console.log("//FULL SQL =============== \n");
//   return new Promise((resolve, reject) =>
//     pool.query(sql, values, (error, results) => {
//       if (error) {
//         console.log(error);
//         reject({ error });
//       } else {
//         resolve(results);
//       } // 쿼리 결과를 전달
//     })
//   );
// };
module.exports = {
  changeSnake2Camel,
  changeCamel2Snake,
  convertCode,
  joinWebCodes,
  justjoin,
  splitDbCodesWithConvertCode,
  splitDbCodesWithLoop,
  convertCodeToNaturalArray,
  convertCodeToNaturalString,
  convertCommaCodeStringToNaturalArray,
  convertCommaCodeStringToNatural,
  replaceRefUrls,
  getNewPostId,
  query,
  queryDynamic,
  getMentorInfoList,
  getMentorInfoTotalCount,
  getConnection
};
