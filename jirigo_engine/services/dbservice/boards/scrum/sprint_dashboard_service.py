from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values
import datetime

from pprint import pprint

class JirigoSprintDashboard(object):
    def __init__(self,data={}):
        print("Initializing JirigoSprintDashboard ")
        print(f'In for Create Sprints **** :{data}')
        # self.sprint_name=data.get('sprint_name','')
        # self.project_name=data.get('project_name','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        # self.sprint_tasks=data.get('sprint_tasks')
        # self.sprint_status=data.get('sprint_status')
        self.sprint_id=data.get('sprint_id')
        self.project_id=data.get('project_id')
        self.sprint_tasks=data.get('sprint_tasks')
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()
        # self.start_date=data.get('start_date')
        # self.end_date=data.get('end_date')

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_all_tasks_attribute_summary(self):
        response_data={}
        self.logger.debug("Sprints Inside get_all_tasks_attribute_summary")
        query_sql="""  
                        WITH tc AS (SELECT json_object_agg(DISTINCT t.priority,t.tot_priority_cnt) priorities,
                                            json_object_agg(DISTINCT  t.severity,t.tot_severity_cnt) severities,
                                            json_object_agg(DISTINCT  t.issue_type,t.tot_issue_type_cnt) issue_types,
                                            json_object_agg(DISTINCT  t.issue_status,t.tot_issue_status_cnt) issue_statuses
                                            FROM (
                                    SELECT priority,severity ,issue_type ,issue_status,
                                        count(priority) over(partition BY priority) tot_priority_cnt,
                                        count(severity) over(partition BY severity) tot_severity_cnt,
                                        count(issue_type ) over(partition BY issue_type) tot_issue_type_cnt,
                                        count(issue_status ) over(partition BY issue_status) tot_issue_status_cnt
                                    FROM v_sprint_details vsd 
                                    WHERE sprint_id=%s ) t
                            
                        )
                        select json_agg(tc) from tc;

                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_all_tasks_attribute_summary ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_all_tasks_attribute_summary {error}')
                raise
    
    def get_sprint_efforts_summary(self):
        response_data={}
        self.logger.debug("Sprints Inside get_sprint_efforts_summary")
        query_sql="""  
                        WITH tc AS (SELECT 
                                            sprint_id,
                                            sprint_name,
                                            sprint_start_date ,
                                            sprint_end_date ,
                                            round(CAST(sum(estimated_time)/60 AS NUMERIC),2) tot_est,
                                            sum(task_actuals)tot_act,
                                            count(*) tot_task_count,
                                            round(CAST(sum(estimated_time)/60-sum(task_actuals) as Numeric),2) tot_rem
                                    FROM v_sprint_details 
                                    WHERE sprint_id=%s
                                    GROUP BY sprint_id,sprint_name,sprint_start_date ,
                                            sprint_end_date ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_sprint_efforts_summary ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_sprint_efforts_summary {error}')
                raise

    def get_sprint_burndown_chart_data(self):
        response_data={}
        self.logger.debug("Sprints Inside get_sprint_burndown_chart_data")
        query_sql="""  
                        WITH jt AS (
                            WITH bdt as(
                                    WITH gen_days AS (
                                            SELECT t2.sprint_id,t2.sprint_name,t2.num_devs,generate_series(t2.start_date::timestamptz ,t2.end_date::timestamptz ,'1 days' ) c_date
                                                ,(
                                                    SELECT round(CAST(sum(tt.estimated_time)/60 AS NUMERIC),2)
                                                    FROM  ttasks tt 
                                                    INNER JOIN tsprint_tasks tst
                                                            ON  tt.task_no=tst.task_no 
                                                        WHERE tst.sprint_id=t2.sprint_id 
                                                ) tot_est
                                            FROM tsprints t2  
                                            WHERE sprint_id=%s)
                                            SELECT gen_days.sprint_id,gen_days.c_date, gen_days.tot_est,
                                                CASE to_char(gen_days.c_date,'Dy')
                                                        WHEN 'Sat' THEN 0
                                                        WHEN 'Sun' THEN 0
                                                        ELSE 8
                                                END AS work_hours,
                                                get_sumof_sprint_actuals_bydate(gen_days.sprint_id,to_char(gen_days.c_date,'dd-Mon-YYYY')) AS actuals,
                                                gen_days.num_devs
                                            FROM gen_days
                                        )
                                SELECT bdt.sprint_id,bdt.c_date,bdt.tot_est,bdt.work_hours,
                                		to_char(bdt.c_date,'dd-Mon') c_date2,
                                		to_char(bdt.c_date,'dd-Mon-YYYY') c_date3,
                                        COALESCE (lag(tot_est,1) over(ORDER BY bdt.c_date),bdt.tot_est) tot_est,
                                        sum(bdt.work_hours) over(ORDER BY bdt.c_date)*bdt.num_devs wk_hrs,
                                        COALESCE(lag(tot_est,1) over(ORDER BY bdt.c_date)-sum(bdt.work_hours) over(ORDER BY bdt.c_date)*bdt.num_devs,bdt.tot_est) ideal_line,
                                        bdt.tot_est- sum(bdt.actuals) OVER (ORDER BY bdt.c_date) actuals
                                FROM bdt)
                        select json_agg(jt) from jt;
                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('~'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_sprint_burndown_chart_data ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_sprint_burndown_chart_data {error}')
                raise

    def get_sprint_workload_by_user(self):
        response_data={}
        self.logger.debug("Sprints Inside get_sprint_workload_by_user")
        query_sql="""  
                        WITH tc AS ( SELECT get_user_name(assignee_id ) user_name,
                                    round(CAST(sum(estimated_time)/60 AS NUMERIC),2) estimated_time 
                                    FROM v_sprint_details 
                                    WHERE sprint_id=%s
                                    GROUP BY get_user_name(assignee_id )
                                    order by estimated_time desc
                      ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_sprint_workload_by_user  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_sprint_workload_by_user {error}')
                raise

    def get_sprint_num_tasks_by_user(self):
        response_data={}
        self.logger.debug("Sprints Inside get_sprint_num_tasks_by_user")
        query_sql="""  
                        WITH tc AS (SELECT get_user_name(assignee_id ) user_name,count(*) cnt 
                                    FROM v_sprint_details 
                                    WHERE sprint_id=%s
                                    GROUP BY  get_user_name(assignee_id ) 
                                    ORDER BY 2 DESC
                      ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_sprint_num_tasks_by_user  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_sprint_num_tasks_by_user {error}')
                raise
    
    def get_task_actuals_by_activity(self):
        response_data={}
        self.logger.debug("Sprints Inside get_task_actuals_by_activity")
        query_sql="""  
                        WITH tc AS (SELECT activity ,sum(actual_time_spent)/60 tot_act
                                    FROM ttask_actuals 
                                    WHERE task_no in (SELECT task_no 
                                                        FROM v_sprint_details vsd  
                                                       WHERE sprint_id=%s )
                                    GROUP BY  activity 
                                    ORDER BY 2 DESC
                      ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_task_actuals_by_activity  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_task_actuals_by_activity {error}')
                raise
    
    def get_task_estimated_vs_actual_efforts(self):
        response_data={}
        self.logger.debug("Sprints Inside get_task_estimated_vs_actual_efforts")
        query_sql="""  
                        WITH tc AS (
                                    WITH 
                                        ts_act AS (
                                        SELECT activity ,sum(actual_time_spent)/60 tot_act
                                                                            FROM ttask_actuals 
                                                                            WHERE task_no in (SELECT task_no 
                                                                                                FROM v_sprint_details vsd  
                                                                                            WHERE sprint_id=%s )
                                                                            GROUP BY  activity 
                                                                            ),
                                        ts_est  AS (                                  
                                        SELECT activity ,sum(estimated_time )/60 tot_est
                                                                            FROM ttask_estimates te 
                                                                            WHERE task_no in (SELECT task_no 
                                                                                                FROM v_sprint_details vsd  
                                                                                            WHERE sprint_id=%s )
                                                                            GROUP BY  activity 
                                                                            )
                                                                            
                                        SELECT  COALESCE (ts_est.activity,COALESCE (ts_act.activity,ts_est.activity)) activity
                                                ,ts_est.tot_est,ts_act.tot_act
                                          FROM ts_est 
                                          FULL OUTER JOIN ts_act ON ts_est.activity=ts_act.activity
                                         ORDER BY 1
                      ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.sprint_id,self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_task_estimated_vs_actual_efforts  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_task_estimated_vs_actual_efforts {error}')
                raise

    def get_count_of_task_in_current_status(self):
        response_data={}
        self.logger.debug("Sprints Inside get_count_of_task_in_current_status")
        query_sql="""  
                        WITH tc AS (
                                    WITH task_status_order AS (
                                                SELECT ref_value,order_id FROM tref_master tm  
                                                 WHERE ref_category ='TASKS' 
                                                   AND ref_name='Status' 
                                                   AND project_id =%s 
                                                 ORDER BY order_id
                                            ),
                                            sprint_task_statuses AS (
                                                SELECT vsd.issue_status,count(*) issue_count
                                                  FROM v_sprint_details vsd 
                                                 WHERE vsd.sprint_id =%s
                                                 GROUP BY vsd.issue_status
                                            )
                                            SELECT tso.*,sts.*
                                              FROM task_status_order tso, sprint_task_statuses sts
                                             WHERE sts.issue_status=tso.ref_value
                                             ORDER BY tso.order_id
                      ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.project_id,self.sprint_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_task_count_by_status  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_task_count_by_status {error}')
                raise