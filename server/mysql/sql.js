module.exports = {
  sblList: `select * from sb_code_data`, //이미 team4로 붙였음.
  applicantsPerDept: `select v.dept_desc "dept_desc",count(v.status) "count",v.status , v.apply_dept_id  "applyDeptId"
  from 
  (
                 select fn_apply_dept_desc(a.apply_dept_id) "dept_desc",fn_apply_status(a.applicant_id ,a.project_id )  "status" ,a.applicant_id,a.apply_dept_id
                 from apply_admin a, apply_dept b   where a.project_id =  1 
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
  manage_HeaderSelect: `select 'babo' from dual`,
};
