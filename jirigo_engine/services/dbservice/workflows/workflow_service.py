from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoWorkflow(object):

    def __init__(self,data={}):
        print("Initializing JirigoWorkflow")
        print(f'In for Create/Update/Delete Workflow ****')
        pprint(data)
        self.project_id = data.get('project_id')
        self.workflow_id = data.get('workflow_id')
        self.workflow_name = data.get('workflow_name')
        self.jdb=JirigoDBConn()

        self.logger=Logger()


    def get_workflow_steps(self):
        response_data={}
        self.logger.debug("Inside get_workflow_steps")
        query_sql="""  
                    with t as (
                    select step_id,step_name,workflow_id
                      from tworkflow_steps tws
                     where tws.workflow_id=%s
                    )
                    select json_build_object('rowData',json_agg(t.refs)) from t ;
                   """
        self.logger.debug(f'Select all sprint : {query_sql}')
        values=(self.workflow_id,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_workflow_steps Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data['rowData']
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_workflow_steps {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_workflow_steps {error}')
                raise
    
    def get_all_workflows(self):
        response_data={}
        self.logger.debug("Inside get_all_workflows")
        query_sql="""  
                    with t as (
                    SELECT workflow_id,workflow_name,workflow_type,
                      from tworkflow_master
                    )
                    select json_build_object('rowData',json_agg(t.refs)) from t ;
                   """
        self.logger.debug(f'Select all sprint : {query_sql}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_workflows Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data['rowData']
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_workflows {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_workflow_steps {error}')
                raise
    

   