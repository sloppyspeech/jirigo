from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTicketDashboard(object):

    def __init__(self,data={}):
        print("Initializing JirigoTicketDashboard")
        print(f'In for Create Dashboard **** :{data}')
        self.project_id = data.get('project_id',0)
        self.jdb=JirigoDBConn()
        self.logger=Logger()


    def get_ticket_dashboard_generic_summary(self):
        response_data={}
        self.logger.debug("Inside get_ticket_audit")
        query_sql="""  
                        WITH t AS
                            (SELECT 'issueStatus' col_header,
                                                    issue_status col_ref_name,
                                                    count(*) cnt
                            FROM ttickets t
                            GROUP BY issue_status
                            UNION ALL SELECT 'issueType' col_header,
                                                            t.issue_type,
                                                            count(*) cnt
                            FROM
                                (SELECT CASE issue_type
                                            WHEN 'Bug' THEN 'Bug'
                                            ELSE 'Others'
                                        END AS issue_type
                                FROM ttickets t2) AS t
                            GROUP BY issue_type
                            UNION ALL SELECT 'Severity' col_header,
                                                        severity,
                                                        count(*) cnt
                            FROM ttickets t
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
            self.logger.debug(f'Select get_ticket_audit Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While getting Ticket Audit {error}')
                raise


    def get_ticket_summary_by_issue_status(self):
        response_data={}
        self.logger.debug("Inside get_ticket_summary_by_issue_status")
        query_sql="""  
                        WITH t AS(
                            SELECT issue_status,count(*) count FROM ttickets t 
                             WHERE project_id =%s
                            GROUP BY issue_status 
                            order by count desc
                            )
                            SELECT json_agg(t)
                            FROM t ;
                   """

        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_ticket_summary_by_issue_status Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_ticket_summary_by_issue_status {error}')
                raise

    def get_ticket_summary_by_issue_type(self):
        response_data={}
        self.logger.debug("Inside get_ticket_summary_by_issue_type")
        query_sql="""  
                        WITH t AS(
                            SELECT issue_type,count(*) count FROM ttickets t 
                             WHERE project_id =%s
                            GROUP BY issue_type 
                            order by count desc
                            )
                            SELECT json_agg(t)
                            FROM t ;
                   """

        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_ticket_summary_by_issue_type Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_ticket_summary_by_issue_type {error}')
                raise