from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTicket(object):

    def __init__(self,data={}):
        print("Initializing JirigoTicket")
        print(f'In for Create/Update Ticket **** :{data}')
        self.ticket_int_id = data.get('ticket_int_id')
        self.jdb=JirigoDBConn()
        self.summary = data.get('summary','')
        self.description = data.get('description','')
        self.severity = data.get('severity','')
        self.priority = data.get('priority','')
        self.issue_type = data.get('issue_type','')
        self.issue_status = data.get('issue_status','')
        self.is_blocking = data.get('is_blocking','N')
        self.environment = data.get('environment','')
        self.channel = data.get('channel','')
        self.created_by = data.get('created_by','')
        self.created_date = datetime.datetime.now()
        self.modified_by = data.get('modified_by','')
        self.modified_date = datetime.datetime.now()
        self.reported_by = data.get('reported_by','')
        self.reported_date = data.get('reported_date',datetime.datetime.now())
        self.ticket_no=data.get('ticket_no','-')
        self.project_name=data.get('project_name','')
        self.project_id=data.get('project_id','')
        self.assignee_name=data.get('assignee_name','')
        self.module=data.get('module','')
        self.assignee_id = data.get('assignee_id','')

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
        insert_sql="""  INSERT INTO TTICKETS(ticket_no,summary,description,severity,priority,
                        issue_status,issue_type,environment,is_blocking,created_by,
                        created_date,reported_by,reported_date,assignee_id,project_id,module,channel) 
                        VALUES (get_issue_no_by_proj(%s),%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                                get_user_id(%s),%s,get_user_id(%s),get_proj_id(%s),%s,%s) returning ticket_no;
                    """
        values=(self.project_name,self.summary,self.description,self.severity,self.priority,
                "Open",self.issue_type,self.environment,self.is_blocking,self.created_by,
                datetime.datetime.today(),self.reported_by,datetime.datetime.today(),
                self.assignee_name,self.project_name,self.module,self.channel,)
        self.logger.debug(f'Insert : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            ticket_int_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) Ticket ID {ticket_int_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"ticket_no":ticket_int_id,"rowCount":row_count}
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
                            SELECT ticket_int_id,
                                    ticket_no,
                                    summary,
                                    description,
                                    issue_status,
                                    issue_type,
                                    severity,
                                    priority,
                                    environment,
                                    is_blocking,
                                    module,
                                    channel,
                                    get_user_name(created_by) created_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') created_date,
                                    get_user_name(modified_by) modified_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') modified_date,
                                    get_user_name(reported_by) reported_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') reported_date,
                                    get_user_name(assignee_id) assigned_to
                              FROM ttickets 
                             WHERE 
                                    project_id=COALESCE(%s,project_id) AND
                                    (
                                        created_by=COALESCE(%s,created_by) AND
                                        COALESCE(assignee_id,-1)=COALESCE(%s,COALESCE(assignee_id,-1)) AND
                                        COALESCE(modified_by,-1)=COALESCE(%s,COALESCE(modified_by,-1))
                                    )
                             order by ticket_int_id
                        )
                        SELECT json_agg(t) from t;
                   """
        self.project_id = None if self.project_id == '' else self.project_id
        self.assignee_id = None if self.assignee_id == '' else self.assignee_id
        self.created_by = None if self.created_by == '' else self.created_by
        self.modified_by = None if self.modified_by == '' else self.modified_by

        values=(self.project_id,self.created_by,self.assignee_id,self.modified_by,)
        self.logger.debug(f'Select : {query_sql} values {values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) Ticket List {json_data}')
            if json_data == None:
                response_data['dbQryStatus']='Failure No Rows'
                response_data['dbQryResponse']={}
            else:
                response_data['dbQryStatus']='Success'
                response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Getting All Tickets {error}')
                raise
    
 
    def get_ticket_details(self):
        self.logger.debug('Inside get_ticket_details')
        response_data={}
        query_sql="""  
                       WITH t AS
                                (SELECT ticket_int_id,
                                        ticket_no,
                                        SUMMARY,
                                        description,
                                        issue_status,
                                        issue_type,
                                        severity,
                                        priority,
                                        environment,
                                        is_blocking,
                                        module,
                                        channel,
                                        get_proj_name(project_id) project_name,
                                        get_user_name(COALESCE(assignee_id, 0)) assignee_name,
                                        get_user_name(COALESCE(created_by, 0)) created_by,
                                        created_date,
                                        get_user_name(COALESCE(modified_by, 0)) modified_by,
                                        modified_date,
                                        get_user_name(COALESCE(reported_by, 0)) reported_by,
                                        reported_date
                                FROM ttickets
                                WHERE TICKET_NO=%s )
                                SELECT json_agg(t)
                                FROM t;
                   """
        values=(self.ticket_no,)
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
                                severity=COALESCE(%s,severity),
                                priority=COALESCE(%s,priority),
                                issue_status=COALESCE(%s,issue_status),
                                issue_type=COALESCE(%s,issue_type),
                                environment=COALESCE(%s,issue_type),
                                modified_by=%s,
                                modified_date=%s,
                                reported_by=COALESCE(get_user_id(%s),reported_by),
                                reported_date=%s,
                                project_id=get_proj_id(%s),
                                assignee_id=get_user_id(%s),
                                is_blocking=%s,
                                module=%s,
                                channel=%s
                         WHERE ticket_no=%s;
                    """
        values=(self.summary,self.description,self.severity,self.priority,
                self.issue_status,self.issue_type,self.environment,self.modified_by,
                datetime.datetime.today(),self.reported_by,datetime.datetime.today(),
                self.project_name,self.assignee_name,self.is_blocking,self.module,self.channel,
                self.ticket_no,)

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

    def clone_ticket(self):
        response_data={}
        new_ticket_no='Error'
        self.logger.debug("Inside Update Ticket update_tickets")

        insert_sql="""
                        INSERT INTO ttickets (ticket_no, SUMMARY, description, issue_status, issue_type, 
                                              severity, priority, environment, is_blocking, module,created_by, 
                                              created_date, reported_by, reported_date, project_id,channel)
                                    SELECT get_issue_no_by_proj(get_proj_name(project_id)),
                                        SUMMARY,
                                        description,
                                        issue_status,
                                        issue_type,
                                        severity,
                                        priority,
                                        environment,
                                        is_blocking,
                                        module,
                                        %s,
                                        %s,
                                        reported_by,
                                        reported_date,
                                        project_id,
                                        channel
                                    FROM ttickets
                                    WHERE ticket_no=%s
                                    returning ticket_no;
                    """
        values=(self.created_by,datetime.datetime.today(),self.ticket_no,)

        self.logger.debug(f'Update : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            new_ticket_no=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"clonedTicketNo":new_ticket_no,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While clone_ticket Ticket {error}')
                raise


    def update_ticket_assignee(self):
        response_data={}
        self.logger.debug("Inside  update_ticket_assignee")
        update_sql="""
                        UPDATE TTICKETS 
                           SET  assignee_id=%s,
                                modified_by=%s,
                                modified_date=%s
                         WHERE ticket_no=%s;
                    """
        values=(self.assignee_id,self.modified_by,self.modified_date,self.ticket_no,)

        self.logger.debug(f'Update : {update_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(update_sql,values)
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"taskNo":self.ticket_no,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While update_ticket_assignee  {error}')
                raise