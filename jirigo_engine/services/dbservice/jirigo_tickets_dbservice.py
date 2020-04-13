from .jirigo_dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTicket(object):

    def __init__(self,data={}):
        print("Initializing JirigiCRUD")
        print(f'In for Create/Update Ticket **** :{data}')
        self.ticket_int_id = data.get('ticket_int_id')
        self.jdb=JirigoDBConn()
        self.summary = data.get('summary')
        self.description = data.get('description')
        self.severity = data.get('severity')
        self.priority = data.get('priority')
        self.issue_type = data.get('issue_type')
        self.environment = data.get('environment')
        self.created_by = data.get('created_by')
        self.created_date = data.get('created_date')
        self.modified_by = data.get('modified_by')
        self.modified_date = data.get('modified_date')
        self.reported_by = data.get('reported_by')
        self.reported_date = data.get('reported_date')
        self.ticket_no=data.get('ticket_no','-')
        self.logger=Logger()

    @classmethod
    def for_create_update_ticket(cls,data):
        print("-"*40)
        print(f'In  for_create_update_ticket Ticket :{data}')
        print("-"*40)
        return cls(data)

    def create_ticket(self):
        response_data={}
        self.logger.debug("Inside Create Ticket")
        insert_sql="""  INSERT INTO TTICKETS(summary,description,severity,priority,
                        issue_status,issue_type,environment,created_by,created_date) 
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) returning ticket_int_id;
                    """
        values=(self.summary,self.description,self.severity,self.priority,
                "Open",self.issue_type,self.environment,self.created_by,datetime.datetime.today(),)
        self.logger.debug(f'Insert : {insert_sql}  {values}')

        update_sql=""" UPDATE TTICKETS 
                          SET ticket_no=%s
                         WHERE ticket_int_id=%s;
                    """
        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            ticket_int_id=cursor.fetchone()[0]
            update_values=('Proj-'+str(ticket_int_id),ticket_int_id,)
            cursor.execute(update_sql,update_values)
            self.logger.debug(f'Update : {update_sql}  {update_values}')
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) Ticket ID {ticket_int_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"ticketId":ticket_int_id,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Ticket {error}')
                raise


    def get_all_tickets(self):
        response_data={}
        self.logger.debug("Inside get_all_tickets")
        query_sql="""  
                        WITH t AS (
                            SELECT * FROM ttickets
                        )
                        SELECT json_agg(t) from t;
                   """

        self.logger.debug(f'Select : {query_sql}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Ticket {error}')
                raise
    
 
    def get_ticket_details(self):
        self.logger.debug('Inside get_ticket_details')
        response_data={}
        query_sql="""  
                        WITH t AS (
                            SELECT * FROM ttickets WHERE TICKET_INT_ID=%s
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.ticket_int_id,)
        # print(f'Select : {query_sql} Values :{values}')
        self.logger.debug(f'Select : {query_sql} Values :{values}')

        try:
            
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            print(f'Select Success with {row_count} row(s) Ticket ID {json_data}')
            self.logger.debug(f'Select Success with {row_count} row(s) Ticket ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.OperationalError) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Ticket :{error.pgcode} == {error.pgerror}')
                print('-'*80)
                raise

    
    def update_ticket(self):
        response_data={}
        self.logger.debug("Inside Update Ticket update_tickets")

        update_sql="""
                        UPDATE TTICKETS 
                           SET  summary=%s,
                                description=%s,
                                severity=%s,
                                priority=%s,
                                issue_status=%s,
                                issue_type=%s,
                                environment=%s,
                                modified_by=%s,
                                modified_date=%s,
                                reported_by=%s,
                                reported_date=%s
                         WHERE ticket_int_id=%s;
                    """
        values=(self.summary,self.description,self.severity,self.priority,
                "Open",self.issue_type,self.environment,self.modified_by,
                datetime.datetime.today(),self.reported_by,datetime.datetime.today(),self.ticket_no,)

        self.logger.debug(f'Update : {update_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(update_sql,values)
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"ticketId":self.ticket_no,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Updating Ticket {error}')
                raise
