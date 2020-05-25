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
        self.role_name=data.get('role_name','')
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
                             SELECT  tr.role_id,tr.role_name,tr.is_active,
		                             tpr.project_id ,get_proj_name(tpr.project_id ) project_name
                                FROM troles tr,tproject_roles tpr
                               WHERE tr.role_id=tpr.role_id
                                 and tr.is_active='Y'
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
        self.logger.debug("remove_project_role ")
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
        del_proj_role="""DELETE FROM tproject_roles 
                                 WHERE project_id=%s
                                   AND role_id=%s
                            """
        
        values=(self.project_id,self.role_id,self.created_by,self.created_date,)
        self.logger.debug(f'{del_proj_role}  values  {values}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(del_proj_role,values)
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s)')

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
            self.logger.debug(f'Insert Success with {row_count} row(s) and role_id {role_id}')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"role_id":role_id,"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While del_role  {error}')
                raise