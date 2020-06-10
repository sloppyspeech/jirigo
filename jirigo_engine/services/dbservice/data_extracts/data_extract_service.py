from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values,Json
import datetime

from pprint import pprint

class JirigoDataExtract(object):
    def __init__(self,data={}):
        print("Initializing JirigoMenus")
        self.project_id=data.get('project_id','')
        self.start_date = data.get('start_date','')
        self.end_date   = data.get('end_date','')

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_all_tickets_for_time_range(self):
        response_data={}
        self.logger.debug("Inside get_all_tickets_for_time_range")
        query_sql="""  
                        WITH t AS (
                                    SELECT 
                                            tt.ticket_no,tt.summary,tt.description,tt.issue_status,
                                            tt.issue_type,tt.severity,tt.priority,tt.environment,tt.is_blocking,
                                            get_user_name(tt.created_by) creeated_by,tt.created_date,
                                            get_user_name(tt.modified_by) modified_by,tt.modified_date,
                                            get_user_name(tt.reported_by) reported_by,tt.reported_date,
                                            get_proj_name(tt.project_id) project_name,
                                            get_user_name(tt.assignee_id) assigned_to,tt.module,tt.channel,
                                            tta.activity,tta.time_spent time_spent_mins,
                                            tta.actual_date,get_user_name(tta.time_spent_by) time_logged_by,
                                            tta.other_activity_comment,tta.timelog_comment
                                    FROM    ttickets tt
                                    LEFT OUTER JOIN tticket_actuals tta 
                                        ON  tt.ticket_no =tta.ticket_no 
                                    WHERE   tt.created_date >= %s
                                      AND   tt.created_date <= %s
                        )
                        SELECT json_agg(t) from t
                   """

        values=(self.start_date,self.end_date,)
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
                print(f'Error While get_all_tickets_for_time_range {error}')
                raise

    def get_all_tasks_for_time_range(self):
        response_data={}
        self.logger.debug("Inside get_all_tasks_for_time_range")
        query_sql="""  
                        WITH t AS (
                                    SELECT 
                                            tt.task_no,tt.summary,tt.description,tt.issue_status,
                                            tt.issue_type,tt.severity,tt.priority,tt.environment,tt.is_blocking,
                                            get_user_name(tt.created_by) creeated_by,tt.created_date,
                                            get_user_name(tt.modified_by) modified_by,tt.modified_date,
                                            get_user_name(tt.reported_by) reported_by,tt.reported_date,
                                            get_proj_name(tt.project_id) project_name,
                                            get_user_name(tt.assignee_id) assigned_to,tt.module_name,
                                            tta.activity,tta.actual_time_spent time_spent_mins,
                                            tta.actual_date,get_user_name(tta.time_spent_by) time_logged_by,
                                            tta.other_activity_comment,tta.timelog_comment
                                    FROM  ttasks tt
                                        LEFT OUTER JOIN ttask_actuals tta 
                                        ON tt.task_no =tta.task_no 
                                    WHERE   tt.created_date >= %s
                                      AND   tt.created_date <= %s
                        )
                        SELECT json_agg(t) from t
                   """

        values=(self.start_date,self.end_date,)
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
                print(f'Error While get_all_tasks_for_time_range {error}')
                raise
    
    