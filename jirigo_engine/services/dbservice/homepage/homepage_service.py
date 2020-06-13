from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values,Json
import datetime

from pprint import pprint

class JirigoHomePage(object):
    def __init__(self,data={}):
        print("Initializing JirigoMenus")
        self.project_id=data.get('project_id','')
        self.project_name=data.get('project_name','')
        self.role_id=data.get('role_id','')
        self.menu_id=data.get('menu_id','')
        self.new_menu_items=data.get('new_menu_items','')
        self.workflow_id=data.get('workflow_id','')
        self.role_name=data.get('role_name','')
        self.is_active=data.get('is_active','')
        self.project_name=data.get('project_name','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()
        self.current_user_id=data.get('current_user_id',0)
        self.num_rows=data.get('num_rows',10)

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def select_query_as_json(self,query_name,query_sql,params):
        self.logger.debug('select_query_as_json')
        response_data={}
        try:
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,params)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'{query_name} {row_count} row(s) T{json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.OperationalError) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Ticket :{error.pgcode} == {error.pgerror}')
                print('-'*80)
                raise


    def get_recent_proj_ticket_task_activities(self):
        self.logger.debug('Inside get_ticket_task_activities_timeline')
        response_data={}
        query_sql="""  
                       WITH t AS
                                (
                                    WITH t_project AS (
                                    SELECT
                                        'PROJECT' AS p_or_u, order_no, item_no, summary, item_type, description, issue_status, issue_type, severity, priority, environment, is_blocking, get_user_name(created_by) created_by, created_date, get_user_name(modified_by) modified_by, modified_date, get_user_name(reported_by) reported_by, reported_date, project_id, assignee_id, module_name,
                                        CASE
                                            WHEN modified_date IS NULL THEN 'C'
                                            WHEN modified_date > created_date THEN 'M'
                                            ELSE 'C'
                                        END AS c_or_m
                                    FROM
                                        v_all_tickets_tasks vatt
                                    WHERE
                                        project_id = %s
                                    ORDER BY
                                        CASE
                                            WHEN modified_date IS NULL THEN created_date
                                            WHEN modified_date > created_date THEN modified_date
                                            ELSE modified_date
                                        END DESC
                                    LIMIT %s),
                                    t_user AS (
                                    SELECT
                                        'USER', order_no, item_no, summary, item_type, description, issue_status, issue_type, severity, priority, environment, is_blocking, get_user_name(created_by) created_by, created_date, get_user_name(modified_by) modified_by, modified_date, get_user_name(reported_by) reported_by, reported_date, project_id, assignee_id, module_name,
                                        CASE
                                            WHEN modified_date IS NULL THEN 'C'
                                            WHEN modified_date > created_date THEN 'M'
                                            ELSE 'C'
                                        END AS c_or_m
                                    FROM
                                        v_all_tickets_tasks vatt
                                    WHERE
                                        project_id =%s
                                        AND ( 
                                                   (created_by = %s AND  modified_by IS NULL )
                                                OR modified_by =%s
                                            )
                                    ORDER BY
                                        CASE
                                            WHEN modified_date IS NULL THEN created_date
                                            WHEN modified_date > created_date THEN modified_date
                                            ELSE modified_date
                                        END DESC
                                    LIMIT %s)
                                    SELECT
                                        *
                                    FROM
                                        t_project
                                    UNION ALL
                                    SELECT
                                        *
                                    FROM
                                        t_user
                                )
                                SELECT json_agg(t)
                                FROM t;
                   """
        values=(self.project_id,self.num_rows,self.project_id,self.current_user_id,self.current_user_id,self.num_rows,)
        self.logger.debug(f'Select : {query_sql} Values :{values}')

        try:
            response_data=self.select_query_as_json('get_ticket_task_activities_timeline',query_sql,values)
            return response_data
        except  (Exception, psycopg2.OperationalError) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Ticket :{error.pgcode} == {error.pgerror}')
                print('-'*80)
                raise