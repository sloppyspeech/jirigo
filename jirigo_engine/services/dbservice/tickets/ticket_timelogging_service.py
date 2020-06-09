from flask import jsonify
from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger

import psycopg2
import datetime

from pprint import pprint

class JirigoTicketLogTime(object):

    def __init__(self,data):
        print("Initializing JirigoTicketLogTime")
        pprint(data)
        self.ticket_no=data.get('ticket_no','')
        self.activity=data.get('activity','')
        self.actual_time_spent=data.get('actual_time_spent',0)
        self.other_activity_comment=data.get('other_activity_comment','')
        self.timelog_comment=data.get('timelog_comment','')
        self.time_spent_by=data.get('time_spent_by','1')
        self.actual_date=data.get('actual_date',datetime.datetime.now())
        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def create_timelog_entry(self):
        response_data={}
        print("Inside Create Comment")
        insert_sql="""  INSERT 
                          INTO tticket_actuals(ticket_no,activity,time_spent,actual_date,
                                             time_spent_by,other_activity_comment,timelog_comment) 
                        VALUES (%s,%s,%s,%s,%s,%s,%s) returning actuals_id;
                    """
        values=(self.ticket_no,self.activity,self.actual_time_spent,self.actual_date,
                self.time_spent_by,self.other_activity_comment,self.timelog_comment)
        self.logger.debug(f'Insert : {insert_sql}  {values}')
        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            actuals_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Ticket Comment Creation Success with {row_count} row(s) User ID {actuals_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"actualsId":actuals_id,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                self.logger.debug(f'Error create_timelog_entry {error}')
                print(f'Error create_timelog_entry {error}')
            raise

    
    def get_timelog_entries_for_ticket(self):
        response_data={}
        self.logger.debug("Inside get_timelog_entries_for_ticket")
        query_sql="""  
                    WITH t AS (
                       SELECT ticket_no,activity,time_spent,actual_date,
                              get_user_name(time_spent_by) time_spent_by,
                              other_activity_comment,timelog_comment 
                         FROM tticket_actuals
                        WHERE ticket_no=%s
                        order by actual_date desc
                    )
                    SELECT json_agg(t) from t;
                   """
        values=(self.ticket_no,)
        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_timelog_entries_for_ticket Select Success with {row_count} row(s) data {json_data}')
           
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                self.logger.debug(f'get_timelog_entries_for_ticket Error While Select Ticket Comments  {error}')
                print(f'get_timelog_entries_for_ticket Error While Select Ticket Comments  {error}')
                raise
