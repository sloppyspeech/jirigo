from flask import jsonify
from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger

import psycopg2
import datetime

from pprint import pprint

class JirigoTasksLogTime(object):

    def __init__(self,data):
        print("Initializing JirigoTasksLogTime")
        pprint(data)
        self.task_no=data.get('task_no','')
        self.activity=data.get('activity','')
        self.actual_time_spent=data.get('actual_time_spent',0)
        self.activity_comment=data.get('activity_comment','')
        self.timelog_comment=data.get('timelog_comment','')
        self.time_spent_by=data.get('time_spent_by','1')
        self.actual_date=data.get('actual_date',datetime.datetime.now())
        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def create_timelog_entry(self):
        response_data={}
        print("Inside Create Comment")
        insert_sql="""  INSERT 
                          INTO ttask_actuals(task_no,activity,actual_time_spent,actual_date,
                                             time_spent_by,activity_comment,timelog_comment) 
                        VALUES (%s,%s,%s,%s,%s,%s,%s) returning actuals_id;
                    """
        values=(self.task_no,self.activity,self.actual_time_spent,self.actual_date,
                self.time_spent_by,self.activity_comment,self.timelog_comment)
        self.logger.debug(f'Insert : {insert_sql}  {values}')
        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            actuals_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Task Comment Creation Success with {row_count} row(s) User ID {actuals_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"actualsId":actuals_id,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                self.logger.debug(f'Error create_timelog_entry {error}')
                print(f'Error create_timelog_entry {error}')
            raise

    
    def get_timelog_entries_for_task(self):
        response_data={}
        self.logger.debug("Inside get_all_users")
        query_sql="""  
                    WITH t AS (
                       SELECT task_no,activity,actual_time_spent,actual_date,
                              get_user_name(time_spent_by) time_spent_by,
                              activity_comment,timelog_comment 
                         FROM ttask_actuals
                        WHERE task_no=%s
                    )
                    SELECT json_agg(t) from t;
                   """
        values=(self.task_no,)
        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_timelog_entries_for_taskSelect Success with {row_count} row(s) data {json_data}')
           
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                self.logger.debug(f'get_timelog_entries_for_task Error While Select Task Comments  {error}')
                print(f'get_timelog_entries_for_task Error While Select Task Comments  {error}')
                raise
