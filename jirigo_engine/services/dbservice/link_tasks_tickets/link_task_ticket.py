from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values
import datetime

from pprint import pprint

class JirigoLinkTaskTicket(object):

    def __init__(self,data={}):
        print("Initializing JirigoLinkTaskTicket")
        pprint(data)
        self.jdb=JirigoDBConn()
        self.project_id=data.get('project_id',0)
        self.search_term=data.get('search_term',0)
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        #-----------
        self.item_no=data.get('item_no','')
        self.relationship=data.get('relationship','')
        self.related_items=data.get('related_items','')
        #-----------
        self.logger=Logger()

    def create_tasks_tickets_links(self):
        response_data={}
        rows=[]
        self.logger.debug("Inside create_link ")
        insert_sql="""  INSERT INTO 
                        tticket_and_task_links( ticket_or_task_no,relationship,linked_ticket_or_task_no,
                                                created_by,created_date) 
                        values %s  
                    """


        print('='*80)
        print(self.related_items)
        print(type(self.related_items))
        rows = [(self.item_no,self.relationship,item['code'],self.created_by,self.created_date) for item in self.related_items] 
        print(rows)
        print('='*80)

        self.logger.debug(f'Insert : {insert_sql} vals {rows}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            execute_values(cursor,insert_sql,rows,template=None,page_size=100)
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) ')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Link {error}')
                raise


    def get_task_or_ticket_depends_on(self):
        response_data={}
        self.logger.debug("Inside get_task_or_ticket_depends_on")
        query_sql="""  
                        WITH t AS (
                            SELECT vatt.*,tatl.*
                              FROM tticket_and_task_links tatl 
                             INNER JOIN  
                                   v_all_tickets_tasks vatt 
                                ON tatl.linked_ticket_or_task_no =vatt.item_no 
                               AND tatl.relationship='Depends On'
                               AND tatl.ticket_or_task_no=%s
                               AND vatt.project_id=%s
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.item_no,self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_task_or_ticket_depends_on  {error}')
                raise
    
    def get_task_or_ticket_related_to(self):
        response_data={}
        self.logger.debug("Inside get_task_or_ticket_related_to")
        query_sql="""  
                         WITH t AS (
                            SELECT vatt.*,tatl.*
                              FROM tticket_and_task_links tatl 
                             INNER JOIN  
                                   v_all_tickets_tasks vatt 
                                ON tatl.linked_ticket_or_task_no =vatt.item_no 
                               AND tatl.relationship='Related To'
                               AND tatl.ticket_or_task_no=%s
                               AND vatt.project_id=%s
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.item_no,self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_task_or_ticket_related_to  {error}')
                raise

    def get_task_or_ticket_duplicted_by(self):
        response_data={}
        self.logger.debug("Inside get_task_or_ticket_duplicted_by")
        query_sql="""  
                         WITH t AS (
                            SELECT vatt.*,tatl.*
                              FROM tticket_and_task_links tatl 
                             INNER JOIN  
                                   v_all_tickets_tasks vatt 
                                ON tatl.linked_ticket_or_task_no =vatt.item_no 
                               AND tatl.relationship='Duplicated By'
                               AND tatl.ticket_or_task_no=%s
                               AND vatt.project_id=%s
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.item_no,self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_task_or_ticket_duplicted_by  {error}')
                raise



    def get_tasks_tickets_for_multiselect_drop_down(self):
        response_data={}
        self.logger.debug("Inside get_all_tasks")
        query_sql="""  
                        WITH t AS (
                            SELECT item_no,substring(summary,0,80) summary
                              FROM v_all_tickets_tasks vatt 
                            WHERE project_id=%s
                              AND ( lower(item_no) LIKE  LOWER(%s)
                                    OR lower(summary) LIKE  LOWER(%s)
                                  )
                             order by order_no
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,f'%{self.search_term}%',f'%{self.search_term}%',)
        self.logger.debug(f'Select : {query_sql} values {values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select get_tasks_tickets_for_multiselect_drop_down Success with {row_count} row(s) ')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_tasks_tickets_for_multiselect_drop_down {error}')
                raise
 
    

    