from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values,Json
import datetime

from pprint import pprint

class JirigoProjectWorkflow(object):
    def __init__(self,data={}):
        print("Initializing JirigoSprints")
        self.workflow_name=data.get('workflow_name','')
        self.workflow_id=data.get('workflow_id',0)
        self.project_id=data.get('project_id','')
        self.role_id=data.get('role_id','')
        self.current_status=data.get('current_status','')
        self.ref_category=data.get('ref_category','')
        self.project_name=data.get('project_name','')
        self.workflow_type=data.get('workflow_type','')
        self.next_allowed_statuses=data.get('next_allowed_statuses','')
        self.step_full_details=data.get('step_full_details','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_next_allowed_workflow_statuses(self):
        response_data={}
        self.logger.debug("Inside get_next_allowed_workflow_statuses")
        query_sql="""  
            
                    WITH t AS (
                                SELECT
                                        tpwm.workflow_id,
                                        jsonb_array_elements(tpws.next_allowed_statuses ) ->> 'status' status,
                                        jsonb_array_elements(tpws.next_allowed_statuses ) ->> 'nextStatuses'  next_allowed_statuses
                                FROM
                                    tproj_workflow_master tpwm,
                                    tproj_role_workflow tprw,
                                    tproj_workflow_steps tpws
                                WHERE
                                    tpwm.project_id = tprw.project_id
                                    AND tpwm.workflow_id = tprw.workflow_id
                                    AND tprw.workflow_id = tpws.workflow_id
                                    AND tpwm.project_id =%s
                                    AND tprw.role_id =%s
                                )
                                SELECT next_allowed_statuses
                                  FROM t
                                 WHERE status=%s                    

                   """
        values=(self.project_id,self.role_id,self.current_status,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) Stes {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=eval(json_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_next_allowed_workflow_statuses {error}')
                raise

    def get_workflow_details_for_update(self):
        response_data={}
        self.logger.debug("Inside get_workflow_details_for_update")
        query_sql="""  
                        WITH t AS (
                             SELECT
                                    tws.step_full_details 
                                FROM
                                    tproj_workflow_master tpwm,
                                    tproj_role_workflow tprw,
                                    tproj_workflow_steps tws 
                                WHERE
                                    tpwm.project_id = tprw.project_id
                                    AND tpwm.project_id =%s
                                    AND tprw.workflow_id =%s
                                    AND tws.workflow_id =tprw.workflow_id 
	                                AND tprw.role_id =%s
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,self.workflow_id,self.role_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            pprint(json_data)
            self.logger.debug(f'Select Success with {row_count} row(s)  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_workflow_details_for_update {error}')
                raise

    def create_project_workflow(self):
        response_data={}
        self.logger.debug("create_workflow ")
        create_workflow_sql="""INSERT
	                             INTO  tproj_workflow_master
                                       (project_id, workflow_name, 
                                        workflow_type, created_by, created_date) 
                               VALUES  (%s,%s,
                                        %s,%s,%s)
                                RETURNING workflow_id;
                            """
        create_workflow_steps_sql = """
                            INSERT 
                              INTO tproj_workflow_steps
                                    (
                                        workflow_id,next_allowed_statuses,step_full_details,
                                        created_by,created_date
                                    )
                            VALUES (
                                        %s,%s,%s,
                                        %s,%s
                            )
                            """
        values_create_workflow=(self.project_id,self.workflow_name,self.workflow_type,self.created_by,self.created_date,)
        self.logger.debug(f'{create_workflow_sql}  values  {values_create_workflow}')
        try:
            print('#'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(create_workflow_sql,values_create_workflow)
            ret_workflow_id=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) Worflow Id {ret_workflow_id}')
            
            print('@'*80)
            values_create_workflow_steps=(ret_workflow_id,Json(self.next_allowed_statuses),Json(self.step_full_details),self.created_by,self.created_date,)
            self.logger.debug(f'{create_workflow_steps_sql}  values  {values_create_workflow_steps}')
            cursor.execute(create_workflow_steps_sql,values_create_workflow_steps)
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s) Worflow Id {ret_workflow_id}')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"ret_workflow_id":ret_workflow_id,"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Project Workflow Tasks {error}')
                raise

    
    def get_all_statuses_for_workflow(self):
        response_data={}
        self.logger.debug("Inside get_all_statuses_for_workflow")
        query_sql="""  
                        WITH t AS (
                                SELECT ref_id ,ref_value,order_id
                                FROM tref_master tm 
                                WHERE ref_category =%s AND REF_NAME='Status'
                                AND project_id=%s
                                ORDER BY order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.ref_category,self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_all_statuses_for_workflow {error}')
                raise

    def get_workflows_not_assigned_to_project_role(self):
        response_data={}
        self.logger.debug("Inside get_workflows_for_project")
        query_sql="""  
                        WITH t AS (
                            SELECT *
                              FROM tproj_workflow_master
                             WHERE project_id=%s
                               and workflow_id NOT IN (
                                   SELECT workflow_id
                                     from tproj_role_workflow
                                    where role_id=%s
                                      and project_id=%s
                               )
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,self.role_id,self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_workflows_not_assigned_to_project_role {error}')
                raise


    def get_project_role_workflow_list_for_update(self):
        response_data={}
        self.logger.debug("Inside get_project_role_workflow_list_for_update")
        query_sql="""  
                        WITH t AS (
                                    SELECT
                                            tr.role_id,
                                            tr.role_name,
                                            tr.is_active,
                                            tpr.project_id ,
                                            get_proj_name(tpr.project_id) project_name,
                                            tprw.workflow_id ,
                                            get_workflow_name (tprw.workflow_id ) workflow_name
                                    FROM troles tr
                                    INNER JOIN tproject_roles tpr ON
                                        tr.role_id = tpr.role_id
                                    LEFT OUTER JOIN tproj_role_workflow tprw ON
                                        tr.role_id = tprw.role_id
                                    WHERE
                                        tr.is_active = 'Y'
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
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_project_role_workflow_list_for_update {error}')
                raise

    def update_project_workflow(self):
        response_data={}
        self.logger.debug("create_workflow ")

        update_workflow_steps_sql = """
                            UPDATE tproj_workflow_steps
                                    SET 
                                        next_allowed_statuses=%s,
                                        step_full_details=%s,
                                        modified_by=%s,
                                        modified_date=%s
                             WHERE workflow_id=%s
                            """
        try:
            print('@'*80)
            values_update_workflow_steps=(Json(self.next_allowed_statuses),Json(self.step_full_details),self.modified_by,self.modified_date,self.workflow_id,)
            self.logger.debug(f'{update_workflow_steps_sql}  values  {values_update_workflow_steps}')
            cursor=self.jdb.dbConn.cursor()
            row_count=cursor.rowcount
            cursor.execute(update_workflow_steps_sql,values_update_workflow_steps)
            self.jdb.dbConn.commit()
            self.logger.debug(f'Update Success with {row_count} row(s) Worflow Id {self.workflow_id}')

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"ret_workflow_id":self.workflow_id,"rowCount":row_count}
            return response_data

        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Updating Project Workflow Tasks {error}')
                raise