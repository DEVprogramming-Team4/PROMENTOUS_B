module.exports = {
  /*--------------------------------------------------------------*/
  /*------------------- 공통 모듈        ---------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*--------------------------------------------------------------*/
  getMainCodes: `select t.* from sb_code_data t where t.code_class_id in ('1','2','5','6','7','8')`,
  getUserNickName: `select user_nickname from user where user_id = ?`,
  getUserImage: `select user_image from user where user_id = ?`,
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
  common_TeamRatingInfo: ``,
  common_MentorRatingInfo: ``,
  common_getRefUrlInfo: `select * from ref_url where post_category = ? and post_id = ?`,
  common_getRefUrlInfoCustomize: `select t.url_title AS "title", t.url_address AS "address" FROM ref_url t
  //where t.post_category = ?  and t.post_id = ?  `,
  common_selectMaxId: `select max(?)+1  from  ? `,
  common_urlDelete: `delete from ref_url where post_category =? and post_id =? `,
  common_urlInsert: `insert into ref_url set ?`,
  common_urlUpdate: `update ref_url where post_category =? and post_id =? `,
  isCode: `  select count(*) "count" from sb_code_data where code_data_name = ? `,
  /*--------------------------------------------------------------*/
  /*-------------------  프로젝트 모집 영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/

  manage_HeaderSelect: `select 'babo' from dual`,
  projectList: `select t2.user_nickname, t2.user_image, t.*
  from project t , user t2
  where t.leader_user = t2.user_id
  and t.status_code = ?
  and t.stack_code like ?
  and (t.title like ? or t2.user_nickname like ? or t.project_desc like ?)
  order by t.created_datetime desc
  limit 8 offset ?;`,
  projectListOnline: `select t2.user_nickname, t2.user_image, t.*
  from project t , user t2
  where t.leader_user = t2.user_id
  and t.status_code = ?
  and t.stack_code like ?
  and t.progress_method = ?
  and (t.title like ? or t2.user_nickname like ? or t.project_desc like ?)
  order by t.created_datetime desc
  limit 8 offset ?;`,
  projectListLargeCity: `select t2.user_nickname, t2.user_image, t.*
  from project t , user t2
  where t.leader_user = t2.user_id
  and t.status_code = ?
  and t.stack_code like ?
  and t.main_area_code like ?
  and (t.title like ? or t2.user_nickname like ? or t.project_desc like ?)
  order by t.created_datetime desc
  limit 8 offset ?;`,
  projectListRestCity: `select t2.user_nickname, t2.user_image, t.*
  from project t , user t2
  where t.leader_user = t2.user_id and t.status_code = ? and t.stack_code like ? and t.sub_aria_code = ?
  order by t.created_datetime desc
  limit 8 offset ?;`,
  projectListDefault: `select t2.user_nickname, t2.user_image, t.*
  from project t , user t2
  where t.leader_user = t2.user_id and t.status_code = 'REC'
  order by t.created_datetime desc
  limit 8`,
  projectDetail: `SELECT * FROM project where project_id = ?`,
  // 로그인처럼 하면 업데이트문을 쓸수있다(그러나 유니크 키 하나정도 있어야한다) 다시말해 풋요청도 같은 쿼리로 받을 수 있다. 물음표에서 받아오려면 컬럼명일치
  projectInsert: `insert into project set ?`,
  urlInsert: `insert into ref_url set ?`,
  deptInsert: `insert into apply_dept set ?`,
  projectLeaderData: `select t.* from user t where t.user_id = ( select t2.leader_user from project t2 where t2.project_id = ? )`,
  getUserReviewHistory: `select * from review where writer_id = ?`,
  leaderProjectHistory: `select t.* from project t where t.project_id in (
    select project_id t where apply_admin v1, project v2 where v1.applicant_id = (select leader_user from project where project_id = ? )
    and v1.apply_status = 'ACC' and v2.status_code ='FIN'
    union all
    select v3.project_id from project v3
    where v3.leader_user = (select leader_user from project where project_id = ? )) order by t.created_datetime
    desc limit 3`, // 쿼리문 에러나서 밑의 걸로 다시 짬. - (질문하기)
  leaderHistory: `/*leaderHistory */
   select   title, project_id  from
  (select title, project_id  from project where leader_user = ? and status_code = 'FIN'
   union
   select title, project_id  from project where project_id in (select project_id from apply_admin where (applicant_id = ? and apply_status = 'ACC' and status_code = 'FIN'))
   ) v1`,
  projectRefUrl: `select * from ref_url where post_id = ? and post_category='RCB'`,

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
  getRecruitCommentList: `select * from project_reply where project_id = ? and del_yn = 'N'`,
  getReviewCommentList: `select * from review_reply where review_id = ? and del_yn = 'N'`,
  registerRecruitComment: `insert into project_reply (project_id, writer_id, contents, parent_id,
  target_id, sequence) values (?, ?, ?, ?, ?, ?) `,
  registerReviewComment: `insert into review_reply (review_id, writer_id, contents, parent_id,
    target_id, sequence) values (?, ?, ?, ?, ?, ?) `,
  updateRecruitComment: `update project_reply set contents = ? where reply_id = ?`,
  updateReviewComment: `update review_reply set contents = ? where reply_id = ?`,
  deleteRecruitComment: `delete from project_reply where reply_id = ?`,
  deleteReviewComment: `delete from review_reply where reply_id = ?`,
  // deleteRecruitComment: `update project_reply set del_yn = 'Y' where project_reply_id = ?`,
  projectRecruitData: `
      select
      t.*
      , fn_acceptedDeptCount(t.apply_dept_id  ) acc_count
      , fn_totalDeptCount(t.apply_dept_id ) total_count
      from apply_dept t where t.project_id = ?  `,

  getCurrentMembers: `
  select  t.* , t2.*
  ,fn_get_username(t.applicant_id) user_nickname
  ,fn_get_applyDeptCode(apply_dept_id ) apply_dept_code
      from apply_admin t , user t2
    where t.apply_status = 'ACC' and t.project_id = ?
      and t.applicant_id = t2.user_id
      order by apply_dept_code `,

  getProjectCount: `SELECT count(project_id) as cnt
  FROM (select t2.user_nickname, t.project_id
    from project t , user t2
    where t.leader_user = t2.user_id
    and t.status_code = ?
    and t.stack_code like ?
    and (t.title like ? or t2.user_nickname like ? or t.project_desc like ?)
    )ta`,
  getProjectOnlineCount: `SELECT count(project_id) as cnt
    FROM (select t2.user_nickname, t.project_id
      from project t , user t2
      where t.leader_user = t2.user_id
      and t.status_code = ?
      and t.stack_code like ?
      and t.progress_method = ?
      and (t.title like ? or t2.user_nickname like ? or t.project_desc like ?)
      )ta`,
  getProjectLargeCityCount: `SELECT count(project_id) as cnt
      FROM (select t2.user_nickname, t.project_id
        from project t , user t2
        where t.leader_user = t2.user_id
        and t.status_code = ?
        and t.stack_code like ?
        and t.main_area_code like ?
        and (t.title like ? or t2.user_nickname like ? or t.project_desc like ?)
        )ta`,
  getProjectViewCount: `SELECT post_id, count(post_id) as viewCnt
  FROM view_count
  where post_category="RCB"
  and post_id = ?
  group by post_id;`,
  getAllReview: `select * from review where project_id = ?`,
  getProjectStack: `SELECT project_id, stack_code
  FROM project
  WHERE status_code = ? and stack_code LIKE ?`,
  getTotalPeople: `select project_id, sum(apply_dept.to) totalPeople
  from apply_dept
  where project_id = ?
  group by project_id;`,
  getAcceptedData: `SELECT project_id, count(project_id) as acceptedCount
  FROM team4.apply_admin
  where apply_status = 'ACC' and project_id = ?
  group by project_id;`,
  /*--------------------------------------------------------------*/
  /*-------------------  후기(리뷰)    영역     --------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  /* 내가 리뷰를 안쓴 +  (내가 리더인+내가ACC받은 프로젝트 ) 의 projectId 와 LIST를 가져옴. */
  ReviewAvailProjectList: `
  WITH
  ct1 AS ( select v3.project_id from review  v3 where v3.writer_id = ?  and v3.del_yn ='N'  )
     SELECT *  from project

     where project_id in (
        select vv.project_Id from
        (select v1.project_id from project v1 where v1.leader_user = ?
        union all
        select v2.project_Id from apply_admin v2 where v2.apply_status ='ACC' and  v2.applicant_id = ?)  vv
        )
     and project_id not in (select project_id from ct1 )
     and  status_code ='FIN'
     `,
  reviewList: `select t2.user_nickname, t2.user_image, t3.stack_code, t.*
  from review t, user t2, project t3
  where t.writer_id = t2.user_id
  and t.project_id = t3.project_id
  and t3.stack_code like ?
  and (t.title like ? or t2.user_nickname like ? or t.desc like ?)
  order by t.created_datetime desc
  limit 8 offset ?;`,
  getReviewViewCount: `SELECT post_id, count(post_id) as viewCnt
  FROM view_count
  where post_category="RVB"
  and post_id = ?
  group by post_id;`,
  reviewDetail: `SELECT * FROM review where review_id = ?`,
  reviewOutcomeUrl: `SELECT * FROM review_outcome_url where review_id = ?`,
  getReviewCount: `SELECT count(review_id) as cnt
  FROM (SELECT t2.user_nickname, t3.stack_code, t.*
    FROM review t, user t2, project t3
    WHERE t.writer_id = t2.user_id
    AND t.project_id = t3.project_id
    AND t3.stack_code like ?
    AND (t.title like ? or t2.user_nickname like ? or t.desc like ?)
    )ta`,
  // getUserHistory: `SELECT t.project_id, t.leader_user, t.status_code, t.title, t2.applicant_id, t2.apply_status
  getUserHistory: `SELECT t.project_id, t.title
  FROM project t, apply_admin t2
  WHERE t.status_code = 'FIN' and (t.leader_user = ? or t2.applicant_id = ?) and t2.apply_status = 'ACC'
  GROUP BY t.project_id;`,
  reviewInsert: `insert into review set ?`,
  outcomeUrlInsert: `insert into review_outcome_url set ?`,
  /*--------------------------------------------------------------*/
  /*-프로젝트 지원 및 승인반려[apply_admin 테이블] (VALIDATION / INSERT )*/
  /*------------------------------------------------------------- -*/
  checkApplyAble: `select  max( applicant_id) flag from apply_admin
  where  project_id = ?
  and applicant_id = ?`,
  insertApplyAdmin: `insert into apply_admin set ? `,
  //insertUser: `insert into user set ? on duplicate key update ?`, // unique key가 있어야 중복 인서트가 안되더라~

  /*--------------------------------------------------------------*/
  /*-------------------  팀 개요    영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  insertRate: `insert into rate set ? on duplicate key update ?`, // unique key가 있어야
  manage_topSelect: `select    t.status_code, '진행중 프로젝트'  AS "statusName",'N' AS "mentor_yn" , t.title as "project_name", t.project_id  from project t where t.project_id  in  (
                    select  v1.project_id  from project v1  where v1.leader_user = ?  and v1.status_code <> 'FIN'
                    union all
                    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = ? and v2.apply_status ='ACC' and v3.status_code <> 'FIN'
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
                        ,fn_applyDeptCode(v.apply_dept_id ) "apply_dept_code"
                        ,fn_user_nickname(v.applicant_id) as "applicant_nickname"
                        ,fn_user_nickname(v.applicant_id) as "user_nickname"
                        ,fn_user_email(v.applicant_id) as "applicant_account"
                        ,fn_user_email(v.applicant_id) as "user_email"
                        ,fn_user_image(v.applicant_id) as "applicant_image"
                        ,fn_user_stack_code(v.applicant_id) as "like_stack_code"
                        ,fn_user_dept_code(v.applicant_id) as "like_dept_code"
                        ,fn_user_intro(v.applicant_id) as "user_intro"
                        ,max(v.insert_date ) as "insertDate"
                        ,max(v.stat) /*1지원중, 2승인, 3반려 */ stat
                        , ( select apply_status from apply_admin
                          where apply_admin_id in (
                          select max(t3.apply_admin_id)
                             from apply_admin t3
                             where  t3.applicant_id = v.applicant_id
                               and t3.project_id =v.project_id
                               )
                          )
                          as "apply_status"
                        ,fn_user_image(v.applicant_id) as "user_image" /*유저이미지 추가*/
                        from (
                        select t.applicant_id, t.project_id, t.apply_dept_id, t.insert_date, t.apply_status,
                        if(t.apply_status = 'NEW', 1, if(t.apply_status = 'ACC',2,  3) ) stat
                        from apply_admin t where t.project_id = ?

                        ) v
                        group by applicant_id
                        order by stat `,
  getTeamMembers: `select 'Y' leader_yn
                  ,fn_user_stack_code(t.user_id) as "like_stack_code"
                  ,fn_user_dept_code(t.user_id) as "like_dept_code"
                  ,fn_user_image(t.user_id) as "member_image"
                  ,fn_user_image(t.user_id) as "user_image"
                  ,fn_user_email(t.user_id) as "member_email"
                  ,t.* from user t
                   where t.user_id = (select  t2.leader_user  from project  t2 where t2.project_id =  ?      )
           union all
                  select  'N' leader_yn
                  ,fn_user_stack_code(t2.user_id) as "like_stack_code"
                  ,fn_user_dept_code(t2.user_id) as "like_dept_code"
                  ,fn_user_image(t2.user_id) as "member_image"
                  ,fn_user_image(t2.user_id) as "user_image"
                  ,fn_user_email(t2.user_id) as "member_email"
                  ,t2.* from user t2
                  where t2.user_id in
                  (select  t3.applicant_id   from apply_admin  t3 where t3.project_id = ?     and t3.apply_status = 'ACC'  )
                  and t2.user_id <> (select v1.leader_user from project v1 where project_Id =  ? ) `,
  getMemberRole: `SELECT fn_apply_dept_desc(apply_dept_id) AS "role"
                  FROM apply_dept
                  where apply_dept_id =
                  (SELECT apply_dept_id
                      FROM  apply_admin
                      where apply_status  = 'ACC'
                      and project_id =  ?
                      and applicant_id = ?
                      limit 1
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
              )
              `,

  getMentoringInfo: `
            select
            t.rate  AS "score"
            ,t.rate_comment  AS "comment"
            ,fn_ratedYn(  'MENTOR',  ?   )  AS "rated"
          from rate  t
          where t.rated_target_id = ?
          and t.rate_type ='MENTOR' /*--하드코딩*/ `,
  updateProject: `
              update project set ? where project_id = ?

  `,
  insertProjectStatus: `
       insert into project_status set ?
  `,

  /*--------------------------------------------------------------*/
  /*-------------------  마이페이지    영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  // 추후 삭제
  // registerRecruitComment: `insert into project_reply (project_id, writer_id, contents, parent_id,
  //   target_id, target_seq) values (?, ?, ?, ?, ?, ?) `,
  // registerReviewComment: `insert into review_reply (review_id, writer_id, contents, parent_id,
  //    target_id, target_seq) values (?, ?, ?, ?, ?, ?) `,
  // projectDetail: `SELECT * FROM project where project_id = ?`,
  insertUser: `insert into user set ? on duplicate key update ?`, // unique key가 있어야 중복 인서트가 안되더라~
  getLoginUser: `select * from user where user_account = ?`,
  userDetail: `select * from user t where user_id = ? `,
  userRate: `SELECT rated_target_id, count(rate_id) as cnt, avg(rate)  as rateAVG
  FROM rate
  where rate_type = 'USER'
  and rated_target_id = ?
  group by rated_target_id;`,
  updateUserInfo: `update user set ? where user_id = ? `,
  /*--------------------------------------------------------------*/
  /*-------------------  멘토리스트    영역--------------------------*/
  /*------------------------------------------------------------- -*/
  // 메인페이지에서 보일 6개 리스트
  mentorListDefault: `select t2.user_nickname, t2.user_image, t.*
  from mentor_info t, user t2
  where t.user_id = t2.user_id and t.mentoring_availability = 'Y'
  order by mentor_register_date desc limit 6`,
  // 멘토링 단에서 보이는 리스트
  mentorListAvail: `/*멘토정보 리스트 가져오기 */

  select   fn_getMantorRate( t1.user_id ) totalRate
          ,fn_getMentorRateCount(t1.user_id ) rateCount
          ,t1.*
          ,t2.*  from mentor_info t1, user t2
  where t2.user_id = t1.user_id
  and t1.mentoring_availability ='Y'
  `,
  // mentorID: `select user_id from mentor_info order by mentor_register_date desc limit 6`,
  /*
  mentorRate: `SELECT rated_target_id, count(rate_id) as cnt, avg(rate)  as rateAVG
  FROM rate
  where rate_type = 'MENTOR'
  and (rated_target_id in (select user_id from mentor_info order by mentor_register_date desc))
  group by rated_target_id;`,
  */
  mentorRate: `SELECT rated_target_id, count(rate_id) as cnt, avg(rate)  as rateAVG
  FROM rate
  where rate_type = 'MENTOR'
  and rated_target_id = ?
  group by rated_target_id;`,
  getRate: `select  IFNULL(rate,0) rate   from rate where rate_type ='MENTOR' and rated_target_Id = ? `,
  getDeptOfMentorInfo: `select mentoring_dept_code from mentor_info
     where mentor_info_id = ?  `,
  checkMentorInfoExist: `select mentor_info_id from mentor_info t where t.user_id =  ?  `,

  /*--------------------------------------------------------------*/
  /*-------------------  멘토 등록신청   영역--------------------------*/
  /*------------------------------------------------------------- -*/
  getMentorInfoMax: `select max(mentor_info_id)+1  "max"  from mentor_info `,
  insertMentorInfo: `insert into mentor_info set ?`,
  insertRefUrlForMentor: `insert into ref_url set ? `,
  updateUserSet: `update user t set ?  where user_id  = ? `,

  /*--------------------------------------------------------------*/
  /*-------------------  멘토디테일    영역--------------------------*/
  /*------------------------------------------------------------- -*/
  mentorBasicInfo: ` /*멘토링 기본정보끌고오기 */
  select   fn_getMantorRate( t1.user_id ) totalRate
  ,fn_getMentorRateCount(t1.user_id ) rateCount
  ,t1.*
  ,t2.*  from mentor_info t1, user t2
where t2.user_id = t1.user_id
and t1.user_id = ?
and t1.mentoring_availability ='Y'
  `,
  mentorReputations: `select t1.rate "score" , t1.rate_comment "comment"
  from rate  t1
  where t1.rate_type ='MENTOR' and t1.rated_target_id = ?
  order by t1.rate desc, rate_register_date desc   ;`,
  mentorHistory: `
  select
    t1.project_id
  ,(select v.title from project v where v.project_id = t1.project_id) "title"
  from mentoring t1, mentoring_admin t2
  where t2.mentoring_id = t1.mentoring_id
  and t2.mentoring_status = 'FIN'
  and t1.mentor_info_id = fn_get_mentorinfo( ?  )
  group by t1.project_id
  `,
  /*TODO 멘토인포 등록하는 멘토입장에서 > 나 어디어디 멘토링하고싶은지 입력하는 부분 + 가져오는 부분 다필요하다!  */

  /*--------------------------------------------------------------*/
  /*-------------------  멘토링 신청하기 영역--------------------------*/
  /*------------------------------------------------------------- -*/
  mentoringRequestFormData: `` /*TODO ! > 신청분야리스트 처리 필요하다. */
};
