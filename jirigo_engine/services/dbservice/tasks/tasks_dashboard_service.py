from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTaskDashboard(object):

    def __init__(self,data={}):
        print("Initializing JirigoTaskDashboard")
        print(f'In for Create Dashboard **** :{data}')
        # self.task_no = data.get('task_no')
        self.jdb=JirigoDBConn()
        self.logger=Logger()


    def get_task_summaries(self):
        response_data={}
        self.logger.debug("Inside get_task_audit")
        query_sql="""  
                        WITH t AS
                            (SELECT 'issueStatus' col_header,
                                                    issue_status col_ref_name,
                                                    count(*) cnt
                            FROM ttasks t
                            GROUP BY issue_status
                            UNION ALL SELECT 'issueType' col_header,
                                                            t.issue_type,
                                                            count(*) cnt
                            FROM
                                (SELECT CASE issue_type
                                            WHEN 'Bug' THEN 'Bug'
                                            ELSE 'Others'
                                        END AS issue_type
                                FROM ttasks t2) AS t
                            GROUP BY issue_type
                            UNION ALL SELECT 'Severity' col_header,
                                                        severity,
                                                        count(*) cnt
                            FROM ttasks t
                            WHERE SEVERITY IN ('High',
                                                'Critical')
                            GROUP BY severity)
                            SELECT json_object_agg(col_header||col_ref_name, cnt)
                            FROM t ;
                   """

        self.logger.debug(f'Select : {query_sql}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
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
