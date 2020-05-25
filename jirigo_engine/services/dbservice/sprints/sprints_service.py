from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values
import datetime

from pprint import pprint

class JirigoSprints(object):
    def __init__(self,data={}):
        print("Initializing JirigoSprints")
        print(f'In for Create Sprints **** :{data}')
        self.sprint_name=data.get('sprint_name','')
        self.project_name=data.get('project_name','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.sprint_tasks=data.get('sprint_tasks')
        self.sprint_status=data.get('sprint_status')
        self.sprint_id=data.get('sprint_id')
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()
        self.start_date=data.get('start_date')
        self.end_date=data.get('end_date')

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_all_not_closed_tasks_byproj_for_sprint(self):
        response_data={}
        self.logger.debug("Inside get_all_not_closed_tickets")
        query_sql="""  
                        WITH t AS (
                            SELECT  task_int_id,
                                    task_no,
                                    summary,
                                    issue_status,
                                    issue_type,
                                    severity,
                                    priority,
                                    module_name
                              FROM ttasks 
                             WHERE project_id=get_proj_id(%s)
                               AND issue_status<>'Closed'
                               AND task_no NOT in 
                                   (select task_no 
                                      from tsprint_tasks 
                                    )
                             order by task_int_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_name,)
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
                print(f'Error While get_all_not_closed_tickets {error}')
                raise

    def create_sprint_with_tasks(self):
        response_data={}
        self.logger.debug("Sprints Service Inside Create Sprint")
        create_sprint_sql="""INSERT INTO 
                              tsprints (sprint_name,project_id,created_by,created_date,status)
                              values(%s,get_proj_id(%s),%s,%s,'Open')
                              returning sprint_id
                            """
        sprint_values=(self.sprint_name,self.project_name,self.created_by,self.created_date,)
        print("======sprint_values========")
        print(sprint_values)
        create_sprint_tasks_sql="""
                                INSERT INTO tsprint_tasks (sprint_id,task_no,created_by,workflow_step_id,created_date)
                                       VALUES %s
                                """
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(create_sprint_sql,sprint_values)
            ret_sprint_id=cursor.fetchone()[0]
            print(f'sprint_tasks {self.sprint_tasks}')
            
            cursor.execute('select get_first_step_id_for_board_workflow(%s)',(self.project_name,))
            first_step_id=cursor.fetchone()[0]
            print(f'First Step id is {first_step_id}')
            task_vals=[(ret_sprint_id,task ,self.created_by,first_step_id) for task in self.sprint_tasks]
            
            print(f'task_vals {task_vals}')
            execute_values(cursor,create_sprint_tasks_sql,task_vals,template="(%s,%s,%s,%s,now())")
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount

            self.logger.debug(f'Insert Success with {row_count} row(s) Sprint ID {ret_sprint_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"sprintId":ret_sprint_id,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Sprint Tasks {error}')
                raise

    def get_all_tasks_of_sprint(self):
        response_data={}
        self.logger.debug("Sprints Inside get_all_not_closed_tickets")
        query_sql="""  
                        WITH t AS (
                            SELECT  t.task_int_id,
                                    t.task_no,
                                    t.summary,
                                    t.issue_status,
                                    t.issue_type,
                                    t.severity,
                                    t.priority,
                                    t.module_name,
                                    ts.sprint_name 
                              FROM ttasks t ,tsprint_tasks tt,tsprints ts
                             WHERE t.issue_status<>'Closed'
                               AND t.task_no=tt.task_no 
                               AND tt.sprint_id =%s
                               AND tt.sprint_id =ts.sprint_id 
                             order by t.task_int_id desc
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_all_tasks_of_sprint ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_all_tasks_of_sprint {error}')
                raise

    def get_all_sprints_for_proj(self):
        response_data={}
        self.logger.debug("Sprints Inside get_all_sprints_for_proj")
        query_sql="""  
                        WITH t AS (
                            SELECT sprint_id,
                                    sprint_name,
                                    get_proj_name(project_id) proj_name,
                                    status,
                                    TO_CHAR(start_date :: DATE, 'yyyy-mm-dd') start_date,
                                    TO_CHAR(end_date :: DATE, 'yyyy-mm-dd') end_date
                              FROM tsprints
                             WHERE project_id=get_proj_id(%s)
                             order by sprint_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_name,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) Sprint Data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_all_sprints_for_proj {error}')
                raise

    def update_sprint_details(self):
        response_data={}
        self.logger.debug("Sprints Service Inside Update Sprint")
        create_sprint_sql="""
                            UPDATE tsprints
                               SET  sprint_name=%s,
                                    status=%s,
                                    start_date=%s,
                                    end_date=%s,
                                    modified_by=%s,
                                    modified_date=%s
                             WHERE  sprint_id=%s;
                            """
        sprint_values=(self.sprint_name,self.sprint_status,self.start_date,self.end_date,self.modified_by,self.modified_date,self.sprint_id,)
        print(sprint_values)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(create_sprint_sql,sprint_values)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s) Sprint ID {self.sprint_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"sprintId":self.sprint_id,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Updating Sprint  {error}')
                raise
    
    def update_sprint_tasks(self):
        response_data={}
        self.logger.debug("Sprints Service Inside Update Sprint Tasks")
        delete_all_sprint_tasks_sql="""
                                        DELETE
                                          FROM tsprint_tasks
                                         WHERE sprint_id=%s
                                    """
        sprint_values=(self.sprint_id,)
        # sprint_values=(self.sprint_name,self.sprint_status,self.start_date,self.end_date,self.modified_by,self.modified_date,self.sprint_id,)
        print(sprint_values)
        
        print("======sprint_values========")
        print(f'sprint_values {sprint_values} at time {self.created_date}')
        self.logger.debug(f'sprint_values {sprint_values} at time {self.created_date}')
        create_sprint_tasks_sql="""
                                INSERT INTO tsprint_tasks (sprint_id,task_no,created_by,workflow_step_id,created_date)
                                       VALUES %s
                                """
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(delete_all_sprint_tasks_sql,sprint_values)
            row_count=cursor.rowcount
            self.logger.debug(f'Delete Success with {row_count} row(s) Sprint ID {self.sprint_id}')
            print(f'sprint_tasks {self.sprint_tasks}')
            task_vals=[(self.sprint_id,x ,self.created_by,self.sprint_id) for x in self.sprint_tasks]
            print(f'task_vals {task_vals}')
            execute_values(cursor,create_sprint_tasks_sql,task_vals,template="(%s,%s,%s,get_first_step_id_for_sprint(%s),now())")
            row_count=cursor.rowcount
            self.logger.debug(f'Bulk Insert Success with {row_count} row(s) Sprint ID {self.sprint_id} at time {self.created_date}')
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"sprintId":self.sprint_id,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Updating Sprint  {error}')
                raise