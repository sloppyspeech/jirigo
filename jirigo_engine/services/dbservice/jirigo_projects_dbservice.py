from .jirigo_dbconn_service import JirigoDBConn
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoProject(object):

    def __init__(self,data):
        print("Initializing JirigoProject")
        pprint(data)
        self.project_name = data['project_name']
        self.project_abbr = data['project_abbr']
        self.created_by = data['created_by']
        self.created_date = data['created_date']
        self.modified_by = None
        self.modified_date = None
        self.is_active = data['is_active']

        self.jdb=JirigoDBConn()


    def create_project(self):
        print("Inside Create Ticket")
        insert_sql="""  INSERT INTO TPROJECTS(project_name,project_abbr,created_by,created_date,is_active) 
                        VALUES (%s,%s,%s,%s,%s) returning project_id;
                    """
        values=(self.project_name,self.project_abbr,self.created_by,datetime.datetime.today(),self.is_active,)
        print(f'Insert : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            ticket_int_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            print(f'Insert Success with {row_count} row(s) Project ID {ticket_int_id}')
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Project {error}')