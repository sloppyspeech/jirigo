from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTaskAudit(object):

    def __init__(self,data={}):
        print("Initializing JirigoTaskAudit")
        print(f'In for Create TaskAudit **** :{data}')
        self.task_no = data.get('task_no')
        self.jdb=JirigoDBConn()
        self.logger=Logger()


    def get_task_audit(self):
        response_data={}
        self.logger.debug("Inside get_task_audit")
        query_sql="""  
                        WITH t AS (
                            SELECT task_no,
                                    column_name,
                                    display_column_name,
                                    old_value,
                                    new_value,
                                    get_user_name(created_by) created_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') created_date
                              FROM htasks 
                             where task_no=%s
                             order by htask_int_id limit 15
                        )
                        SELECT json_agg(t) from t;
                   """

        values=(self.task_no,)
        self.logger.debug(f'Select : {query_sql} values {values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select get_task_audit Success with {row_count} row(s) Task ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While getting Task Audit {error}')
                raise

    