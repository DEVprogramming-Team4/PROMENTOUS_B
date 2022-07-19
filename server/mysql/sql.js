module.exports = {
  /*--------------------------------------------------------------*/
  /*------------------- 공통 모듈        ---------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*--------------------------------------------------------------*/
  getMainCodes: `select t.* from sb_code_data t where t.code_class_id in ('1','2','5','6','7','8')`,
  getUserNickName: `select user_nickname from user where user_id = ?`,
  sblList: `select * from sb_code_data`,
  applicantsPerDept: `select v.dept_desc "dept_desc",count(v.status) "count",v.status , v.apply_dept_id  "applyDeptId"
      from
        (
          select fn_apply_dept_desc(a.apply_dept_id) "dept_desc",fn_apply_status(a.applicant_id ,a.project_id )  "status" ,a.applicant_id,a.apply_dept_id
          from apply_admin a, apply_dept b   where a.project_id =  ?
          and a.project_id =b.project_id
          group by a.applicant_id
        ) v
        group by v.status,v.apply_dept_id
    `,
  common_deptList: `SELECT * FROM  sb_code_data where code_class_id =1`, //분야코드 가져오기
  common_stackList: `SELECT * FROM sb_code_data where code_class_id =2`, //언어스택코드가져오기
  common_mainArea: `SELECT * FROM sb_code_data where code_class_id =3`, //대지역코드가져오기
  common_subArea: `SELECT * FROM sb_code_data where code_class_id = 4 and upper(attribute1) like ?`, //서브지역가져오기
  common_statusList: `SELECT * FROM sb_code_data where code_class_id =6  `, //팀상태분류가져오기
  common_applyStatusList: `SELECT * FROM sb_code_data where code_class_id =7`, //지원상태분류가져오기
  common_boardTypes: `SELECT * FROM sb_code_data where code_class_id =8`, //지원상태분류가져오기
  /*--------------------------------------------------------------*/
  /*-------------------  프로젝트 모집 영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  applicantsPerDept: ``,
  manage_HeaderSelect: `select 'babo' from dual`,
  projectList: `select t2.user_nickname , t.*
  from project t , user t2
  where t.leader_user = t2.user_id and t.status_code = ?
  order by t.created_datetime desc
  limit 8 offset ?;`,
  projectListDefault: `select t2.user_nickname , t.*
  from project t , user t2
  where t.leader_user = t2.user_id and t.status_code = 'REC'
  order by t.created_datetime desc
  limit 8`,
  projectDetail: `SELECT * FROM project where project_id = ?`,
  // 로그인처럼 하면 업데이트문을 쓸수있다(그러나 유니크 키 하나정도 있어야한다) 다시말해 풋요청도 같은 쿼리로 받을 수 있다. 물음표에서 받아오려면 컬럼명일치
  projectInsert: `insert into project set ?`,
  projectLeaderData: `select t.* from user t where t.user_id = ( select t2.leader_user from project t2 where t2.project_id = ? )`,
  leaderProjectHistory: `select t.* from project t where t.project_id in (
    select project_id t where apply_admin v1, project v2 where v1.applicant_id = (select leader_user from project where project_id = ? )
    and v1.apply_status = 'ACC' and v2.status_code ='FIN'
    union all
    select v3.project_id from project v3
    where v3.leader_user = (select leader_user from project where project_id = ? )) order by t.created_datetime
    desc limit 3`, // 쿼리문 에러나서 밑의 걸로 다시 짬. - (질문하기)
  leaderHistory: `/*leaderHistory */ 
   select   title, project_id  from
  (select title, project_id  from project where leader_user = ?
   union
   select title, project_id  from project where project_id in (select project_id from apply_admin where (applicant_id = ? and apply_status = 'ACC'))
   ) v1`,
  projectRefUrl: `select * from ref_url where post_id = ? and post_category='RCB'`,

  projectRecruitList: `SELECT * FROM project`, // 모집글id(클릭시 이걸로 넘겨주기..?) 시작예정일, 모집상태, 프로젝트명, 작성자이름, 스크랩수, 뷰수, 유징스택
  getTeamMentoringList: `select  fn_get_username(  t.user_id ) ,  t.mentoring_title, t2.mentoring_id  ,t2.mentoring_status, t2.created_datetime, fn_get_curr_mentoringstatus( t2.mentoring_id ) AS "current_status"
  from mentor_info t,  mentoring_admin t2
 where t2.mentoring_id in (
        /* project id 하나에 여러 멘토링 걸려 있을 수 있음. */
        select v1.mentoring_id from mentoring v1 where v1.project_id = ?
 )
 order by
 case  current_status
      when 'ING' then 1
      when 'NEW' then 2
      when 'REJ' then 100
      else  50
 end
 limit  ? , 3 `,
  registerRecruitComment: `insert into project_reply (project_id, writer_id, comment, parent_id,
  target_id, sequence) values (?, ?, ?, ?, ?, ?) `,
  registerReviewComment: `insert into review_reply (review_id, writer_id, comment, parent_id,
   target_id, sequence) values (?, ?, ?, ?, ?, ?) `,
  projectRecruitData: `
      select 
      t.*
      , fn_acceptedDeptCount(t.apply_dept_id  ) acc_count
      , fn_totalDeptCount(t.apply_dept_id ) total_count
      from apply_dept t where t.project_id = ?  `,
  getCount: `select count(project_id) as cnt from project where project.status_code = ?;`,
  /*--------------------------------------------------------------*/
  /*-------------------  후기    영역     --------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  reviewDetail: `SELECT * FROM review where review_id = ?`,
  reviewOutcomeUrl: `SELECT * FROM review_outcome_url where review_id = ?`,

  /*--------------------------------------------------------------*/
  /*-------------------  팀 개요    영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  manage_topSelect: `select    t.status_code, '진행중 프로젝트'  AS "statusName",'N' AS "mentor_yn" , t.title as "project_name", t.project_id  from project t where t.project_id  in  (
                    select  v1.project_id  from project v1  where v1.leader_user = ?  and v1.status_code <> 'FIN'
                    union all
                    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = ? and v2.apply_status ='ACC' and v3.status_code <> 'FIN' and v3.status_code <> 'REC'
                    )
                    union all
                    select      t.status_code  ,'완료된 프로젝트' AS  "statusName",'N' AS "mentor_yn"  , t.title  as "project_name", t.project_id from project t where t.project_id  in   (
                    select  v1.project_id  from project v1  where v1.leader_user = ?    and v1.status_code ='FIN'
                    union all
                    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = ? and v2.apply_status ='ACC' and v3.status_code ='FIN'
                    )
                    union all
                    select   t.status_code  ,'진행중 멘토링' AS "statusName",'Y' AS "mentor_yn" , t.title  as "project_name", t.project_id   from project t where t.project_id  in  (
                    select v1.project_id  from mentoring v1 where v1.mentor_info_id = fn_get_mentorinfo( ?  )  and v1.status_code in ('ACC', 'ING' )
                    )
                    union all
                    select   t.status_code  ,'완료된 멘토링' AS "statusName" ,'Y' AS "mentor_yn" , t.title  as "project_name", t.project_id   from project t where t.project_id  in  (
                    select v1.project_id  from mentoring v1 where v1.mentor_info_id = fn_get_mentorinfo(?  )  and v1.status_code = 'FIN'
                    )

                    `,
  ///getProjectInfo 를 위한 쿼리 세트들
  getTeamDatas: `select * from project where project_id = ?`,
  getTeamRefUrls: `select * from ref_url where post_category ='TMB' and post_id = ?`,
  getTeamApplicants: `select
                        v.applicant_id
                        ,v.project_id
                        ,v.apply_dept_id
                        ,fn_user_nickname(v.applicant_id) as "applicant_nickname"
                        ,fn_user_email(v.applicant_id) as "applicant_account"
                        ,fn_user_image(v.applicant_id) as "applicant_image"
                        ,fn_user_stack_code(v.applicant_id) as "like_stack_code"
                        ,fn_user_dept_code(v.applicant_id) as "like_dept_code"
                        ,max(v.insert_date ) as "insertDate"
                        ,max(v.stat) /*1지원중, 2승인, 3반려 */ stat
                        ,max(v.stat)  as "applyStatus"

                        from (
                        select t.applicant_id, t.project_id, t.apply_dept_id, t.insert_date, t.apply_status,
                        if(t.apply_status = 'NEW', 1, if(t.apply_status = 'ACC',2,  3) ) stat
                        from apply_admin t where t.project_id = ?
                        ) v
                        group by applicant_id
                        order by stat `,
  //getTeamMembers  > ? 2개
  getTeamMembers: `select 'Y' leader_yn
                  ,fn_user_stack_code(t.user_id) as "like_stack_code"
                  ,fn_user_dept_code(t.user_id) as "like_dept_code"
                  ,fn_user_image(t.user_id) as "member_image"
                  ,fn_user_email(t.user_id) as "member_email"
                  ,t.* from user t
                   where t.user_id = (select  t2.leader_user  from project  t2 where t2.project_id =  ?      )
           union all
                  select  'N' leader_yn
                  ,fn_user_stack_code(t2.user_id) as "like_stack_code"
                  ,fn_user_dept_code(t2.user_id) as "like_dept_code"
                  ,fn_user_image(t2.user_id) as "member_image"
                  ,fn_user_email(t2.user_id) as "member_email"
                  ,t2.* from user t2
                  where t2.user_id in
                  (select  t3.applicant_id   from apply_admin  t3 where t3.project_id = ?     and t3.apply_status = 'ACC'  ) `,
  getMemberRole: `SELECT fn_apply_dept_desc(apply_dept_id) AS "role"
                  FROM apply_dept
                  where apply_dept_id =
                  (SELECT apply_dept_id
                      FROM  apply_admin
                      where apply_status  = 'ACC'
                      and project_id =  ?
                      and applicant_id = ?
                    ) ;
  `,
  getMemberRating: `            select             
  t.rate  AS "score"
  ,t.rate_comment  AS "comment"
  ,fn_ratedYn(  'USER',  ?   )  AS "rated"
from rate  t 
where t.rated_target_id = ? 
and t.rate_type ='USER'/*하드코딩*/  
and t.rate_user_id = ?
and t.project_id = ?
`,
  getUserSocialUrls: `SELECT t.url_title AS "title", t.url_address AS "address" FROM ref_url t
  where t.post_category ='USB' and t.post_id = ?`,
  /*멘토링 정보 가져오기 풀버전*/
  getTeamMentoringList2: `/*FULL버전 현재 상황에서 사용 어려움. */
        select
            fn_get_mentorStatusNum (fn_get_curr_mentoringstatus( t2.mentoring_id )) AS "current_status_number"
            , fn_get_curr_mentoringstatus( t2.mentoring_id ) AS "current_status"
            , t2.mentoring_id
            ,( select fn_getMentorname( fn_getMentorinfo( t2.mentoring_id) )  )   "user_name" /*멘토닉네임*/
            , (select v1.mentoring_title from mentor_info v1 where v1.mentor_info_id = fn_getMentorinfo( t2.mentoring_id) )  "mentoring_title"
            ,t2.mentoring_status
            , t2.created_datetime
        from  mentoring_admin t2
            where t2.mentoring_id in   (
                  /* project id 하나에 여러 멘토링 걸려 있을 수 있음. */
                  select v2.mentoring_id from mentoring v2 where v2.project_id = ?
            )
                order by
                  case  current_status
                      when 'ING' then 1
                      when 'NEW' then 2
                      when 'REJ' then 100
                      else  50
                  end
                `,

  getTeamMentoringTotalPage: `select ceil(count(*)/4) total_count from mentoring v2 where v2.project_id = ?`,
  getTeamMentoringList: ` /* 숫자만 던져주는 버전 - 시간정보는 없음. */
          select
              fn_get_mentorStatusNum (fn_get_curr_mentoringstatus( t.mentoring_id )) AS "mentoring_status"
              ,( select fn_getMentorname( fn_getMentorinfo( t.mentoring_id) )  )   "mentor_user_id" /*멘토닉네임*/
              , (select v2.mentoring_title from mentor_info v2 where v2.mentor_info_id = fn_getMentorinfo( t.mentoring_id) )  "mentoring_title"
              ,t.mentoring_id AS "mentoring_id"    
          from mentoring t 
              where t.mentoring_id in (
                     select v2.mentoring_id from mentoring v2 where v2.project_id = ?      
              )     /*최초 이므로 (하드코딩) limit 0 4 로만 땡겨온다.*/   
              LIMIT 0,4
              `,
  /* 멘토링정보 페이지 번호기준으로 가져오기  */
  getTeamMentoringListBySelectedPage: `
          select   
              fn_get_mentorStatusNum (fn_get_curr_mentoringstatus( t.mentoring_id )) AS "mentoring_status"
              ,( select fn_getMentorname( fn_getMentorinfo( t.mentoring_id) )  )   "mentor_user_id" /*멘토닉네임*/
              , (select v2.mentoring_title from mentor_info v2 where v2.mentor_info_id = fn_getMentorinfo( t.mentoring_id) )  "mentoring_title"
              ,t.mentoring_id AS "mentoring_id"
              ,'hardcodingdummydata'  AS "mentor_rating_comment"
              ,'hardcodingdummydata'  AS "mentor_rating_score"
          from mentoring t
              where t.mentoring_id in (
                     select v2.mentoring_id from mentoring v2 where v2.project_id = ?      
              )
              LIMIT ?, ?   
              `,
  getMentoringInfo: `
            select             
            t.rate  AS "score"
            ,t.rate_comment  AS "comment"
            ,fn_ratedYn(  'MENTOR',  ?   )  AS "rated"
          from rate  t 
          where t.rated_target_id = ? 
          and t.rate_type ='MENTOR' /*--하드코딩*/ `,

  /*--------------------------------------------------------------*/
  /*-------------------  마이페이지    영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  reviewList: ``,
  // parentId도 추가 필요..
  registerRecruitComment: `insert into project_reply (project_id, writer_id, comment, parent_id,
    target_id, target_seq) values (?, ?, ?, ?, ?, ?) `,
  registerReviewComment: `insert into review_reply (review_id, writer_id, comment, parent_id,
     target_id, target_seq) values (?, ?, ?, ?, ?, ?) `,
  projectList: `select t2.user_nickname , t.*
  from project t , user t2
  where t.leader_user = t2.user_id and t.status_code = 'REC'
  order by t.created_datetime desc limit 8;`,
  projectDetail: `SELECT * FROM project where project_id = ?`,
  reviewList: ``,
  insertUser: `insert into user set ? on duplicate key update ?`, // unique key가 있어야 중복 인서트가 안되더라~
  getLoginUser: `select * from user where user_nickname = ?`, // 컬럼을 지정해도 왜 라잌 스택 뎁트코드를 가져오냐?
  // 멘토리스트 관련
  getmentorList: `select * from mentor_info`
};
