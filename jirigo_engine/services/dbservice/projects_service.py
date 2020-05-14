from flask import jsonify
import psycopg2
import datetime
import time

from .dbconn_service import JirigoDBConn
from services.logging.logger import Logger

from pprint import pprint

class JirigoProjects(object):

    def __init__(self,data):
        print("Initializing JirigoProject")
        pprint(data)
        self.user_id = data.get('user_id',0)
        self.project_name = data.get('project_name')
        self.parent_project_id = data.get('parent_project_id',0)
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
        insert_sql="""  INSERT INTO TPROJECTS(project_name,project_abbr,project_type,created_by,created_date,is_active,workflow_id) 
                        VALUES (%s,%s,%s,%s,%s,%s,1) returning project_id;
                    """
        values=(self.project_name,self.project_abbr,self.project_type,self.created_by,self.created_date,self.is_active,)
        print(f'Insert : {insert_sql}  {values}')

        insert_project_refs="""
                        INSERT INTO tref_master (ref_category ,ref_name ,ref_value ,is_active ,
                                                created_by ,created_date ,order_id,project_id )
                                        SELECT  ref_category ,ref_name ,ref_value ,is_active ,
                                                created_by ,%s ,order_id,%s 
                                          FROM  tref_master 
                                         WHERE project_id=%s;
                    """

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            
            cursor.execute(insert_sql,values)
            project_id=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) New Project ID {project_id}')
            
            values=(self.created_date,project_id,self.parent_project_id,)
            cursor.execute(insert_project_refs,values)
            # cursor.fetchone()[0]
            row_count=cursor.rowcount

            self.jdb.dbConn.commit()
            
            self.logger.debug(f'Insert References Success with {row_count} row(s) ')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"projectId":project_id,"rowCount":1}

            print("Going to sleep for 10 seconds")
            time.sleep(10)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Project {error}')
                self.logger.debug(f'Error While Creating Project {error}')
                raise
        
    def get_all_projects(self):
        response_data={}
        self.logger.debug("Inside get_all_projects")
        query_sql="""  
                    WITH t AS (
                    select *
                        from tprojects 
                    where is_active='Y'
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
            self.logger.debug(f'get_all_projects Select Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Projects {error}')
                raise

    def get_all_projects_for_user(self):
        response_data={}
        self.logger.debug("Inside get_all_projects_for_user")
        query_sql="""  
                    WITH t AS (
                            SELECT t.user_id,t.email,tup.default_project ,
                                   tp.project_name ,tp.project_id,tp.project_abbr,
                                   get_user_name(t.user_id) user_name
                              FROM tuser_projects tup,tusers t ,tprojects tp  
                             WHERE tup.project_id = tp.project_id 
                               AND tup.user_id =t.user_id 
                               AND t.user_id =%s
                              ORDER BY tp.project_id
                    )
                    SELECT json_agg(t) from t;
                   """
        values=(self.user_id,)
        self.logger.debug(f'Select : {query_sql} values{values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_projects_for_user Select Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select get_all_projects_for_user {error}')
                raise

