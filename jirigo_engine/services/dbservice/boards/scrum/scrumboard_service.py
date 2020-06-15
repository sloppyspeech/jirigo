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
        self.sprint_tasks=data.get('sprint_tasks')
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
                                    trm.ref_value ,trm.ref_key,tbws.step_id,
                                    tsptt.*
                                FROM
                                    tboard_workflow_master twm
                                INNER JOIN tboard_workflow_steps tbws ON
                                    twm.workflow_id = tbws.workflow_id
                                INNER JOIN tref_master trm ON
                                    trm.ref_key = tbws.step_key
                                LEFT OUTER JOIN (
                                    SELECT
                                        t.task_int_id, t.task_no, t.summary, t.issue_status, 
                                        t.issue_type, t.severity, t.priority, t.module_name, 
                                        ts.sprint_name, trm.ref_value as ref_value1
                                    FROM
                                        ttasks t, tsprint_tasks tt, tsprints ts, 
                                        tboard_workflow_master tbwm, 
                                        tboard_workflow_steps tbws, 
                                        tref_master trm
                                    WHERE
                                        t.task_no = tt.task_no
                                        AND tt.sprint_id = %s
                                        AND tt.sprint_id = ts.sprint_id
                                        AND ts.workflow_id = tbwm.workflow_id
                                        AND tbwm.workflow_id = tbws.workflow_id
                                        AND tbws.step_key = trm.ref_key
                                        AND tt.board_step = tbws.step_key ) AS tsptt ON
                                    trm.ref_value = tsptt.ref_value1
                                WHERE
                                    tbws.workflow_id = (SELECT workflow_id 
                                                          FROM tsprints
                                                         WHERE sprint_id=%s)
                        ) 
                        SELECT 
                        JSON_AGG(col) 
                        FROM 
                        (
                            SELECT 
                            JSON_BUILD_OBJECT(
                                t.step_id||'$'||t.ref_value, 
                                JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'task_no', t.task_no, 'summary', t.summary, 
                                    'issue_status', t.issue_status, 
                                    'issue_type', t.issue_type, 'severity', 
                                    t.severity, 'priority', t.priority, 
                                    'module_name', t.module_name, 'sprint_name', 
                                    t.sprint_name,'step_id',t.step_id,
                                    'ref_key',t.ref_key
                                )
                                )
                            ) AS col 
                            FROM 
                            t 
                            GROUP BY 
                            t.step_id||'$'||t.ref_value
                            ORDER BY t.step_id||'$'||t.ref_value
                            
                        ) c;

                   """
        values=(self.sprint_id,self.sprint_id,)
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

    def update_sprint_task_steps_for_scrumboard(self):
        response_data={}
        self.logger.debug("Inside  update_sprint_task_steps_for_scrumboard")
        update_sql="""
                        UPDATE tsprint_tasks 
                           SET  board_step=%s,
                                modified_by=%s,
                                modified_date=%s
                         WHERE task_no=%s
                           AND sprint_id=%s;
                    """
        
        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()

            for row in self.sprint_tasks:
                self.logger.debug(row)
                for k,v in row.items():
                    values=(v,self.modified_by,self.modified_date,k,self.sprint_id,)
                    self.logger.debug(f'Update : {update_sql}  {values}')
                    cursor.execute(update_sql,values)
                    self.jdb.dbConn.commit()

            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While update_sprint_task_steps_for_scrumboard  {error}')
                raise   