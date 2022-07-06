module.exports = {
  sblList: `select * from sb_code_data`, //이미 team4로 붙였음.
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
  projectRefUrl: `select * from ref_url where post_id = ? and post_category='RCB'`
};
