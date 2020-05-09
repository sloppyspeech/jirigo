from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values
import datetime

from pprint import pprint

class JirigoScrumBoard(object):
    def __init__(self,data={}):
        print("Initializing JirigoScrumBoard")
        print(f'In for Create Sprints **** :{data}')
        # self.sprint_name=data.get('sprint_name','')
        # self.project_name=data.get('project_name','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        # self.sprint_tasks=data.get('sprint_tasks')
        # self.sprint_status=data.get('sprint_status')
        self.sprint_id=data.get('sprint_id')
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()
        # self.start_date=data.get('start_date')
        # self.end_date=data.get('end_date')

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_all_tasks_of_sprint_for_scrum_board(self):
        response_data={}
        self.logger.debug("Sprints Inside get_all_not_closed_tickets")
        query_sql="""  
                        WITH t AS (
                                SELECT 
                                    t.task_int_id, 
                                    t.task_no, 
                                    t.summary, 
                                    t.issue_status, 
                                    t.issue_type, 
                                    t.severity, 
                                    t.priority, 
                                    t.module_name, 
                                    ts.sprint_name, 
                                    ts2.step_name 
                                    FROM 
                                    ttasks t, 
                                    tsprint_tasks tt, 
                                    tsprints ts, 
                                    tworkflow_steps ts2, 
                                    tref_master tm, 
                                    tworkflow_steps_to_status tsts 
                                WHERE 
                                    t.task_no = tt.task_no 
                                    AND tt.sprint_id = %s
                                    AND tt.sprint_id = ts.sprint_id 
                                    AND ts.workflow_id = ts2.workflow_id 
                                    AND tm.ref_category = 'TASKS' 
                                    AND tm.ref_name = 'STATUS' 
                                    AND tm.ref_value = t.issue_status 
                                    AND tsts.step_id = ts2.step_id 
                                    AND tsts.status_id = tm.ref_id 
                                    ORDER BY 
                                t.task_int_id DESC
                        ) 
                        SELECT 
                        JSON_AGG(col) 
                        FROM 
                        (
                            SELECT 
                            JSON_BUILD_OBJECT(
                                t.step_name, 
                                JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'task_no', t.task_no, 'summary', t.summary, 
                                    'issue_status', t.issue_status, 
                                    'issue_type', t.issue_type, 'severity', 
                                    t.severity, 'priority', t.priority, 
                                    'module_name', t.module_name, 'sprint_name', 
                                    t.sprint_name
                                )
                                )
                            ) AS col 
                            FROM 
                            t 
                            GROUP BY 
                            t.step_name
                        ) c;

                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_all_tasks_of_sprint_for_scrum_board ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_all_tasks_of_sprint_for_scrum_board {error}')
                raise
