module.exports = {
  /*--------------------------------------------------------------*/
  /*------------------- 공통 모듈        ---------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*--------------------------------------------------------------*/

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
  projectInsert: `insert into project set ?`, //set 키벨류로 DB에  INSERT / UPDATE  된다.
  // TABLE COLUMN 실제 명과 matching 필요함.

  common_deptList: `SELECT * FROM  sb_code_data where code_class_id =1;`,
  common_stackList: `SELECT * FROM sb_code_data where code_class_id =2;`,
  common_mainArea: `SELECT * FROM sb_code_data where code_class_id =3;`,
  common_subArea: `SELECT * FROM sb_code_data where code_class_id = 4 and upper(attribute1) like ?;`,

  /*--------------------------------------------------------------*/
  /*-------------------  프로젝트 모집 영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  applicantsPerDept: ``,
  manage_HeaderSelect: `select 'babo' from dual`,
  projectRecruitList: `SELECT * FROM project`, // 모집글id(클릭시 이걸로 넘겨주기..?) 시작예정일, 모집상태, 프로젝트명, 작성자이름, 스크랩수, 뷰수, 유징스택
  projectDetail: `SELECT * FROM project where project_id = ?`,
  projectLeaderData: `select t.* from user t where t.user_id = ( select t2.leader_user from project t2 where t2.project_id = ? )`,
  leaderProjectHistory: `select t.* from project t where t.project_id in (
    select project_id t where apply_admin v1, project v2 where v1.applicant_id = (select leader_user from project where project_id = ? )
    and v1.apply_status = 'ACC' and v2.status_code ='FIN'
    union all
    select v3.project_id from project v3
    where v3.leader_user = (select leader_user from project where project_id = ? )) order by t.created_datetime
    desc limit 3`, // 쿼리문 에러나서 밑의 걸로 다시 짬. - (질문하기)
  leaderHistory: `select * from project where leader_user = ? union
    select * from project where project_id in (select project_id from apply_admin where (applicant_id = ? and apply_status = 'ACC'))`,
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
  /*--------------------------------------------------------------*/
  /*-------------------  후기    영역     --------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/

  /*--------------------------------------------------------------*/
  /*-------------------  팀 개요    영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  testInsert: `insert into test set ? `,
  testMyTeamList: `select '진행중 프로젝트'  AS "team_type",'N' AS "mentor_yn" , t.*  from project t where t.project_id  in  (
    select  v1.project_id  from project v1  where v1.leader_user = 3  and v1.status_code <> 'FIN' and v1.status_code <> 'REC'
    union all
    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = 1 and v2.apply_status ='ACC' and v3.status_code <> 'FIN' and v3.status_code <> 'REC')
   union all
  select '완료된 프로젝트' AS  "team_type",'N' AS "mentor_yn" , t.* from project t where t.project_id  in   (
    select  v1.project_id  from project v1  where v1.leader_user = 3    and v1.status_code ='FIN'
    union all
    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = 1 and v2.apply_status ='ACC' and v3.status_code ='FIN'
)
   union all
select '진행중 멘토링' AS "team_type",'Y' AS "mentor_yn"  , t.* from project t where t.project_id  in  (
    select v1.project_id  from mentoring v1 where v1.mentor_info_id = fn_get_mentorinfo( 1   )  and v1.status_code in ('ACC', 'ING' )
)
   union all
select '완료된 멘토링' AS "team_type" ,'Y' AS "mentor_yn" , t.* from project t where t.project_id  in  (
    select v1.project_id  from mentoring v1 where v1.mentor_info_id = fn_get_mentorinfo( 1  )  and v1.status_code = 'FIN'
);`,
  testGet: `select * from test where ? `,

  /*--------------------------------------------------------------*/
  /*-------------------  마이페이지    영역--------------------------*/
  /* 셀렉트박스  ,  viewcount validation 등등..                      */
  /*------------------------------------------------------------- -*/
  // parentId도 추가 필요..
  registerRecruitComment: `insert into project_reply (project_id, writer_id, comment, parent_id,
   target_id, target_seq) values (?, ?, ?, ?, ?, ?) `,
  registerReviewComment: `insert into review_reply (review_id, writer_id, comment, parent_id,
    target_id, target_seq) values (?, ?, ?, ?, ?, ?) `
};
