from flask import jsonify
import psycopg2
import datetime

from .dbconn_service import JirigoDBConn
from services.logging.logger import Logger

from pprint import pprint

class JirigoProject(object):

    def __init__(self,data):
        print("Initializing JirigoProject")
        pprint(data)
        self.project_name = data.get('project_name')
        self.project_abbr = data.get('project_abbr')
        self.project_type = data.get('project_type')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by = None
        self.modified_date = None
        self.is_active = data.get('is_active','Y')

        self.jdb=JirigoDBConn()
        self.logger=Logger()


    def create_project(self):
        response_data={}
        self.logger.debug("Inside Create Project")
        insert_sql="""  INSERT INTO TPROJECTS(project_name,project_abbr,project_type,created_by,created_date,is_active) 
                        VALUES (%s,%s,%s,%s,%s,%s) returning project_id;
                    """
        values=(self.project_name,self.project_abbr,self.project_type,self.created_by,self.created_date,self.is_active,)
        print(f'Insert : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            project_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) Project ID {project_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"projectId":project_id,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Project {error}')
                self.logger.debug(f'Error While Creating Project {error}')
                raise