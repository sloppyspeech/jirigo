from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTask(object):

    def __init__(self,data={}):
        print("Initializing JirigoTask")
        print(f'In for Create/Update Task ****')
        pprint(data)
        self.task_int_id = data.get('task_int_id')
        self.jdb=JirigoDBConn()
        self.summary = data.get('summary')
        self.description = data.get('description')
        self.severity = data.get('severity')
        self.priority = data.get('priority')
        self.issue_type = data.get('issue_type')
        self.issue_status = data.get('issue_status')
        self.is_blocking = data.get('is_blocking','N')
        self.environment = data.get('environment')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by = data.get('modified_by')
        self.modified_date = datetime.datetime.now()
        self.reported_by = data.get('reported_by')
        self.reported_date = data.get('reported_date')
        self.task_no=data.get('task_no','-')
        self.project_name=data.get('project_name','')
        self.assignee_name=data.get('assignee_name','')
        self.module_name=data.get('module_name','')
        self.logger=Logger()

    def create_task(self):
        response_data={}
        self.logger.debug("Inside Create Task")
        insert_sql="""  INSERT INTO 
                        TTASKS( task_no,summary,description,severity,priority,
                                issue_status,issue_type,environment,is_blocking,created_by,
                                created_date,reported_by,reported_date,assignee_id,project_id,module_name) 
                        VALUES (get_issue_no_by_proj(%s),%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                                get_user_id(%s),%s,get_user_id(%s),get_proj_id(%s),%s) returning task_no;
                    """
        values=(self.project_name,self.summary,self.description,self.severity,self.priority,
                "Open",self.issue_type,self.environment,self.is_blocking,self.created_by,
                datetime.datetime.today(),self.reported_by,datetime.datetime.today(),
                self.assignee_name,self.project_name,self.module_name,)
        self.logger.debug(f'Insert : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            task_no=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Insert Success with {row_count} row(s) Task ID {task_no}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"taskNo":task_no,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Task {error}')
                raise


    def get_all_tasks(self):
        response_data={}
        self.logger.debug("Inside get_all_tasks")
        query_sql="""  
                        WITH t AS (
                            SELECT task_int_id,
                                    task_no,
                                    summary,
                                    description,
                                    issue_status,
                                    issue_type,
                                    severity,
                                    priority,
                                    environment,
                                    is_blocking,
                                    module_name,
                                    get_user_name(created_by) created_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') created_date,
                                    get_user_name(modified_by) modified_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') modified_date,
                                    get_user_name(reported_by) reported_by,
                                    to_char(created_date, 'DD-Mon-YYYY HH24:MI:SS') reported_date
                              FROM ttasks 
                             order by task_int_id
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
            self.logger.debug(f'Select Success with {row_count} row(s) Task ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Task {error}')
                raise
    
 
    def get_task_details(self):
        self.logger.debug('Inside get_task_details')
        response_data={}
        query_sql="""  
                       WITH t AS
                                (SELECT task_int_id,
                                        task_no,
                                        SUMMARY,
                                        description,
                                        issue_status,
                                        issue_type,
                                        severity,
                                        priority,
                                        environment,
                                        is_blocking,
                                        module_name,
                                        get_proj_name(project_id) project_name,
                                        get_user_name(COALESCE(assignee_id, 0)) assignee_name,
                                        get_user_name(COALESCE(created_by, 0)) created_by,
                                        created_date,
                                        get_user_name(COALESCE(modified_by, 0)) modified_by,
                                        modified_date,
                                        get_user_name(COALESCE(reported_by, 0)) reported_by,
                                        reported_date
                                FROM ttasks
                                WHERE TASK_NO=%s )
                                SELECT json_agg(t)
                                FROM t;
                   """
        values=(self.task_no,)
        # print(f'Select : {query_sql} Values :{values}')
        self.logger.debug(f'Select : {query_sql} Values :{values}')

        try:
            
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            print(f'Select Success with {row_count} row(s) Task ID {json_data}')
            self.logger.debug(f'Select Success with {row_count} row(s) Task ID {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.OperationalError) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Task :{error.pgcode} == {error.pgerror}')
                print('-'*80)
                raise

    
    def update_task(self):
        response_data={}
        self.logger.debug("Inside Update Task update_tasks")

        update_sql="""
                        UPDATE TTASKS 
                           SET  summary=%s,
                                description=%s,
                                severity=%s,
                                priority=%s,
                                issue_status=%s,
                                issue_type=%s,
                                environment=%s,
                                modified_by=get_user_id(%s),
                                modified_date=%s,
                                reported_by=get_user_id(%s),
                                reported_date=%s,
                                project_id=get_proj_id(%s),
                                assignee_id=get_user_id(%s),
                                is_blocking=%s,
                                module_name=%s  
                         WHERE task_no=%s;
                    """
        values=(self.summary,self.description,self.severity,self.priority,
                self.issue_status,self.issue_type,self.environment,self.modified_by,
                datetime.datetime.today(),self.reported_by,datetime.datetime.today(),
                self.project_name,self.assignee_name,self.is_blocking,self.module_name,
                self.task_no,)

        self.logger.debug(f'Update : {update_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(update_sql,values)
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"taskNo":self.task_no,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Updating Task {error}')
                raise

    def clone_task(self):
        response_data={}
        new_task_no='Error'
        self.logger.debug("Inside Update Task update_tasks")

        insert_sql="""
                        INSERT INTO ttasks (task_no, SUMMARY, description, issue_status, issue_type, 
                                              severity, priority, environment, is_blocking, module,created_by, 
                                              created_date, reported_by, reported_date, project_id)
                                    SELECT get_issue_no_by_proj(get_proj_name(project_id)),
                                        SUMMARY,
                                        description,
                                        issue_status,
                                        issue_type,
                                        severity,
                                        priority,
                                        environment,
                                        is_blocking,
                                        module_name,
                                        %s,
                                        %s,
                                        reported_by,
                                        reported_date,
                                        project_id
                                    FROM ttasks
                                    WHERE task_no=%s
                                    returning task_no;
                    """
        values=(self.created_by,datetime.datetime.today(),self.task_no,)

        self.logger.debug(f'Update : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            new_task_no=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"taskNo":new_task_no,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While clone_task Task {error}')
                raise
