from flask import jsonify
from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger

import psycopg2
import datetime

from pprint import pprint

class JirigoTaskComments(object):

    def __init__(self,data):
        print("Initializing JirigoUsers")
        pprint(data)
        self.task_no=data.get('task_no','')
        self.comment=data.get('comment','')
        self.created_by=data.get('created_by','1')
        self.created_date=data.get('created_date',datetime.datetime.now())
        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def create_comment(self):
        response_data={}
        print("Inside Create User")
        insert_sql="""  INSERT INTO TTASK_COMMENTS(task_no,comment,created_by,created_date) 
                        VALUES (%s,%s,%s,%s) returning comment_id;
                    """
        values=(self.task_no,self.comment,self.created_by,datetime.datetime.today(),)
        self.logger.debug(f'Insert : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            comment_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Task Comment Creation Success with {row_count} row(s) User ID {comment_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"commentId":comment_id,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                self.logger.debug(f'Error While Creating Task Comment {error}')
                print(f'Error While Creating Task Comment {error}')
            raise

    
    def get_tasks_all_comments(self):
        response_data={}
        self.logger.debug("Inside get_all_users")
        query_sql="""  
                    WITH t AS (
                    select comment_id,task_no,comment_text,get_user_name(created_by) created_by,
						to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') created_date
                        from ttask_comments 
                    where is_active='Y'
                      and task_no=%s
                      order by comment_id desc
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
            self.logger.debug(f'Task Comments Select Success with {row_count} row(s) data {json_data}')
           
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                self.logger.debug(f'get_tasks_all_comments Error While Select Task Comments  {error}')
                print(f'get_tasks_all_comments Error While Select Task Comments  {error}')
                raise
