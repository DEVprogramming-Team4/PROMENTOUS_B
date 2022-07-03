module.exports = {
  sblList: `select * from sb_code_data`, //이미 team4로 붙였음.
  applicantsPerDept: `select v.dept_desc "dept_desc",count(v.status) "count",v.status , v.apply_dept_id  "applyDeptId"
  from 
  (
                 select fn_apply_dept_desc(a.apply_dept_id) "dept_desc",fn_apply_status(a.applicant_id ,a.project_id )  "status" ,a.applicant_id,a.apply_dept_id
                 from apply_admin a, apply_dept b   where a.project_id =  ? 
         and a.project_id =b.project_id
         group by a.applicant_id
   )   v
   group by v.status,v.apply_dept_id
 `,
  projectInsert: `insert into project set ?`, //set 키벨류로 DB에  INSERT / UPDATE  된다.
  // TABLE COLUMN 실제 명과 matching 필요함.

  common_deptList: `SELECT * FROM  sb_code_data where code_class_id =1;`,
  common_stackList: `SELECT * FROM sb_code_data where code_class_id =2;`,
  common_mainArea: `SELECT * FROM sb_code_data where code_class_id =3;`,
  common_subArea: `SELECT * FROM sb_code_data where code_class_id = 4 and upper(attribute1) like ?;`,

  applicantsPerDept: ``,

  /*팀개요화면  */
  manage_topSelect: `select '진행중 프로젝트'  AS "team_type" , t.project_id,  t.title  from project t where t.project_id  in  (
    select  v1.project_id  from project v1  where v1.leader_user = ?    and v1.status_code <> 'FIN' and v1.status_code <> 'REC'
    union all 
    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = ? and v2.apply_status ='ACC' and v3.status_code <> 'FIN' and v3.status_code <> 'REC'     
) 
   union all 
select '완료된 프로젝트' AS  "team_type" , t.project_id,  t.title  from project t where t.project_id  in   (
    select  v1.project_id  from project v1  where v1.leader_user = ?    and v1.status_code ='FIN'
    union all 
    select v2.project_id  from apply_admin v2, project v3 where v2.project_id = v3.project_id  and  v2.applicant_id = ? and v2.apply_status ='ACC' and v3.status_code ='FIN'  
)
   union all 
select '진행중 멘토링' AS "team_type"  , t.project_id , t.title from project t where t.project_id  in  ( 
    select v1.project_id  from mentoring v1 where v1.mentor_info_id = fn_get_mentorinfo(  ?  )  and v1.status_code in ('ACC', 'ING' )   
)   
   union all 
select '완료된 멘토링' AS "team_type"  , t.project_id , t.title from project t where t.project_id  in  ( 
    select v1.project_id  from mentoring v1 where v1.mentor_info_id = fn_get_mentorinfo(   ?  )  and v1.status_code = 'FIN' 
)   
`,
  getTeamCommunicateUrls: `select t.* from ref_url  t where post_category='TMB' and post_id  = ? `,
  getTeamDatas: `select t.* from  project t where project_id = ? `,
  getTeamApplicants: `select v.applicant_id, v.project_id, v.apply_dept_id, max(v.insert_date ), max(v.stat)
       /*1지원중, 2승인, 3반려 */ stat from (
    select t.applicant_id, t.project_id, t.apply_dept_id, t.insert_date, t.apply_status,
    if(t.apply_status = 'NEW', 1, if(t.apply_status = 'ACC',2,  3) ) stat   from apply_admin t where t.project_id = ?`,
  getTeamMemberInfo: `select t.* from user t where t.user_id = (select  t2.leader_user  from project  t2 where t2.project_id =  ?     )
  union all
select  t2.* from user t2 where t2.user_id in 
  (select  t3.applicant_id   from apply_admin  t3 where t3.project_id =  ?      and t3.apply_status = 'ACC'  ) `,
  getTeamMentoringInfo: `select  fn_get_username(  t.user_id ) ,  t.mentoring_title, t2.mentoring_id  ,t2.mentoring_status, t2.created_datetime, fn_get_curr_mentoringstatus( t2.mentoring_id ) AS "current_status"
  from mentor_info t,  mentoring_admin t2 
 where t2.mentoring_id in   (
        /* project id 하나에 여러 멘토링 걸려 있을 수 있음. */
        select v1.mentoring_id from mentoring v1 where v1.project_id = ?           
 )  
order by  
 case  current_status 
      when 'ING' then 1
      when 'NEW' then 2 
      when 'REJ' then 100
      else  50
 end  `,
};
