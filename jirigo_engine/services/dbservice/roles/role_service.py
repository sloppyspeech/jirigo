from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values,Json
import datetime

from pprint import pprint

class JirigoRoles(object):
    def __init__(self,data={}):
        print("Initializing JirigoRoles")
        self.project_id=data.get('project_id','')
        self.project_name=data.get('project_name','')
        self.role_id=data.get('role_id','')
        self.workflow_id=data.get('workflow_id','')
        self.role_name=data.get('role_name','')
        self.user_id=data.get('user_id','')
        self.new_roles_values=data.get('new_roles_values','')
        self.is_active=data.get('is_active','')
        self.project_name=data.get('project_name','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_all_active_roles(self):
        response_data={}
        self.logger.debug("Inside get_all_roles")
        query_sql="""  
                        WITH t AS (
                             SELECT role_id,
                                    role_name,
                                    created_date,
                                    get_user_name(created_by) created_by,
                                    modified_date,
                                    get_user_name(modified_by) modified_by,
                                    is_active
                               FROM troles
                              WHERE is_active='Y'
                        )
                        SELECT json_agg(t) from t;
                   """
        self.logger.debug(f'Select : {query_sql} ')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_all_roles {error}')
                raise

    def get_roles_active_for_allprojects(self):
        response_data={}
        self.logger.debug("Inside get_active_project_roles")
        query_sql="""  
                        WITH t AS (
                                    SELECT
                                        tr.role_id,
                                        tr.role_name,
                                        tr.is_active,
                                        tpr.project_id ,
                                        get_proj_name(tpr.project_id) project_name,
                                        get_workflow_name (tprw.workflow_id ) workflow_name
                                FROM troles tr
                                INNER JOIN tproject_roles tpr ON
                                    tr.role_id = tpr.role_id
                                LEFT OUTER JOIN tproj_role_workflow tprw ON
                                    tr.role_id = tprw.role_id
                                WHERE
                                    tr.is_active = 'Y'
                                order by tr.role_id 
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_active_project_roles {error}')
                raise



    def add_project_role(self):
        response_data={}
        self.logger.debug("add_project_role ")
        insert_proj_role_sql="""INSERT
	                             INTO  tproject_roles
                                       (project_id, role_id, 
                                        created_by, created_date) 
                               VALUES  (%s,%s,
                                        %s,%s);
                            """
        
        values_create_workflow=(self.project_id,self.role_id,self.created_by,self.created_date,)
        self.logger.debug(f'{insert_proj_role_sql}  values  {values_create_workflow}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_proj_role_sql,values_create_workflow)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s)')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While add_project_role  {error}')
                raise

    def remove_project_role(self):
        response_data={}
        self.logger.debug("remove_project_role ")
        del_proj_role="""DELETE   FROM tproject_roles 
                                 WHERE project_id=%s
                                   AND role_id=%s
                            """
        
        values=(self.project_id,self.role_id,)
        self.logger.debug(f'{del_proj_role}  values  {values}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(del_proj_role,values)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Delete Success with {row_count} row(s)')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While remove_project_role  {error}')
                raise

    def add_role(self):
        response_data={}
        self.logger.debug("add_role ")
        del_proj_role=""" INSERT 
                            INTO troles
                                 (role_id,
                                  role_name,is_active,created_by,created_date)
                          VALUES ((
                                    select max(role_id)+1 from troles
                                  ),
                                   %s,%s,%s,%s) 
                                returning role_id;
                            """
        
        values=(self.role_name,'Y',self.created_by,self.created_date,)
        self.logger.debug(f'{del_proj_role}  values  {values}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(del_proj_role,values)
            role_id=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s) and role_id {role_id}')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"role_id":role_id,"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While add_role  {error}')
                raise


    def update_role(self):
        response_data={}
        self.logger.debug("remove_project_role ")
        upd_proj_role_sql=""" UPDATE troles
                                    SET is_active=%s,
                                        role_name=%s,
                                        modified_by=%s,
                                        modified_date=%s
                                  WHERE role_id=%s;
                            """
        
        values_create_workflow=(self.is_active,self.role_name,self.modified_by,self.modified_date,self.role_id,)
        self.logger.debug(f'{upd_proj_role_sql}  values  {values_create_workflow}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(upd_proj_role_sql,values_create_workflow)
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Update Success with {row_count} row(s)')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While update_role  {error}')
                raise

    def del_role(self):
        response_data={}
        self.logger.debug("add_role ")
        del_role=""" UPDATE troles
                             SET is_active='N',
                                 modified_by=%s,
                                 modified_date=%s
                           WHERE role_id=%s;
                            """
        
        values=(self.modified_by,self.modified_date,self.role_id,)
        self.logger.debug(f'{del_role}  values  {values}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(del_role,values)
            role_id=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Delete Success with {row_count} row(s) and role_id {role_id}')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"role_id":role_id,"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While del_role  {error}')
                raise
    
    def assign_workflow_to_role(self):
        response_data={}
        self.logger.debug("assign_workflow_to_role ")
        assign_wf_to_role_sql=""" INSERT 
                             INTO tproj_role_workflow
                                  (project_id,role_id,workflow_id,created_by,created_date)
                            VALUES (%s,%s,%s,%s,%s )
                            """
        
        values=(self.project_id,self.role_id,self.workflow_id,self.created_by,self.created_date,)
        self.logger.debug(f'{assign_wf_to_role_sql}  values  {values}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(assign_wf_to_role_sql,values)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s) ')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While assign_workflow_to_role  {error}')
                raise 

    def get_roles_for_user_assignment(self):
        #Get all the assigned and unassigned roles to a user for a project
        response_data={}
        self.logger.debug("Inside get_roles_for_user_assignment")
        query_sql="""  
                        WITH t AS (
                                    SELECT  tu.user_id,tu.email,tpr.project_id ,tpr.role_id ,
                                            get_role_name(tpr.role_id) role_name,
                                            get_proj_name(tpr.project_id) project_name,
                                            toj.*
                                        FROM tusers tu
                                        INNER JOIN tuser_projects tup 
                                            ON tu.user_id =tup.user_id 
                                        INNER JOIN tproject_roles tpr
                                            ON tup.project_id =tpr.project_id 
                                        LEFT OUTER JOIN (
                                                            SELECT tu.user_id assigned_user_id,tu.email ,tup.project_id assigned_proj_id,
					 		                                       tupr.is_default ,tupr.role_id assigned_role_id
                                                            FROM tusers tu 
                                                            INNER JOIN tuser_projects tup 
                                                                ON tu.user_id =tup.user_id 
                                                            INNER JOIN tuserproject_roles tupr 
                                                                ON tu.user_id =tupr.user_id 
                                                                AND tupr.project_id =tup.project_id 
                                              ) toj 
                                           ON tpr.project_id =toj.assigned_proj_id
                                          AND tpr.role_id =toj.assigned_role_id
                                          AND tu.user_id =toj.assigned_user_id
                                        WHERE tu.user_id=%s
                                          AND tup.project_id =%s
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.user_id,self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_roles_for_user_assignment {error}')
                raise

    def assign_roles_to_user(self):
        response_data={}
        self.logger.debug("assign_roles_to_user")
        delete_all_menus_for_role="""
                                        DELETE
                                          FROM tuserproject_roles
                                         WHERE user_id=%s
                                           AND project_id=%s
                                           
                                    """
        role_values=(self.user_id,self.project_id,)
        print(role_values)
        print("======role_values========")
        print(f'role_values {role_values} at time {self.created_date}')
        self.logger.debug(f'role_values {role_values} at time {self.created_date}')
        assign_roles_to_user="""
                                INSERT INTO tuserproject_roles (user_id,project_id,role_id,is_default,created_by,created_date)
                                       VALUES %s
                                """
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(delete_all_menus_for_role,role_values)
            row_count=cursor.rowcount
            self.logger.debug(f'Delete Success with {row_count} row(s)  ID {self.role_id}')
            print(f'new_roles_values {self.new_roles_values}')
            role_vals=[(x['user_id'],x['project_id'],x['role_id'],'Y' if x['is_default'] else 'N',self.created_by,self.created_date) for x in self.new_roles_values]
            print(f'menu_vals {role_vals}')
            execute_values(cursor,assign_roles_to_user,role_vals,template="(%s,%s,%s,%s,%s,%s)")
            row_count=cursor.rowcount
            self.logger.debug(f'Bulk Insert Success with {row_count} row(s)  ID {self.role_id} at time {self.created_date}')
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"dataAdded":self.new_roles_values,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Assigning Roles to user  {error}')
                raise