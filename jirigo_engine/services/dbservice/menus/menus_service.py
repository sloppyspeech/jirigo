from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values,Json
import datetime

from pprint import pprint

class JirigoMenus(object):
    def __init__(self,data={}):
        print("Initializing JirigoMenus")
        self.project_id=data.get('project_id','')
        self.project_name=data.get('project_name','')
        self.role_id=data.get('role_id','')
        self.menu_id=data.get('menu_id','')
        self.new_menu_items=data.get('new_menu_items','')
        self.workflow_id=data.get('workflow_id','')
        self.role_name=data.get('role_name','')
        self.is_active=data.get('is_active','')
        self.project_name=data.get('project_name','')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def get_all_menus_details_for_projectrole(self):
        response_data={}
        self.logger.debug("Inside get_all_menus_details_for_projectrole")
        query_sql="""  
                        WITH t AS (
                                    SELECT
                                        *
                                    FROM
                                        v_role_menu_details vrm
                                    WHERE
                                            vrm.role_id =%s
                                        AND vrm.project_id =%s
                        )
                        SELECT json_agg(t) from t
                   """

        values=(self.role_id,self.project_id,)
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
                print(f'Error While get_all_menus_details_for_projectrole {error}')
                raise

    def get_all_unassigned_menus_for_projectrole(self):
        response_data={}
        self.logger.debug("Inside get_all_unassigned_menus_for_projectrole")
        query_sql="""  
                        WITH t AS (
                                    SELECT
                                        *
                                    FROM
                                        v_menu_details vmd
                                    WHERE
                                        menu_id NOT IN (
                                        SELECT
                                            menu_id
                                        FROM
                                            v_role_menu_details vrmd
                                        WHERE
                                            project_id = %s
                                            AND role_id = %s)
                                        AND menu_id <> 1
                        )
                        SELECT json_agg(t) from t
                   """

        values=(self.project_id,self.role_id,)
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
                print(f'Error While get_all_unassigned_menus_for_projectrole {error}')
                raise
    
    def get_all_assigned_menus_for_projectrole(self):
        response_data={}
        self.logger.debug("Inside get_all_assigned_menus_for_projectrole")
        query_sql="""  
                        WITH t AS (
                                    SELECT
                                        *
                                    FROM
                                        v_menu_details vmd
                                    WHERE
                                        menu_id IN (
                                        SELECT
                                            menu_id
                                        FROM
                                            v_role_menu_details vrmd
                                        WHERE
                                            project_id = %s
                                            AND role_id = %s)
                                        AND menu_id <> 1
                        )
                        SELECT json_agg(t) from t
                   """

        values=(self.project_id,self.role_id,)
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
                print(f'Error While get_all_assigned_menus_for_projectrole {error}')
                raise

    def add_menus_to_role(self):
        response_data={}
        self.logger.debug("add_menus_to_role")
        delete_all_menus_for_role="""
                                        DELETE
                                          FROM trole_menus
                                         WHERE role_id=%s
                                    """
        role_values=(self.role_id,)
        # role_values=(self.role_name,self.role_status,self.start_date,self.end_date,self.modified_by,self.modified_date,self.role_id,)
        print(role_values)
        
        print("======role_values========")
        print(f'role_values {role_values} at time {self.created_date}')
        self.logger.debug(f'role_values {role_values} at time {self.created_date}')
        add_menus_for_role="""
                                INSERT INTO trole_menus (role_id,menu_id,created_by,created_date)
                                       VALUES %s
                                """
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(delete_all_menus_for_role,role_values)
            row_count=cursor.rowcount
            self.logger.debug(f'Delete Success with {row_count} row(s)  ID {self.role_id}')
            print(f'new_menu_items {self.new_menu_items}')
            menu_vals=[(self.role_id,x['menu_id'],self.created_by,self.created_date) for x in self.new_menu_items]
            print(f'menu_vals {menu_vals}')
            execute_values(cursor,add_menus_for_role,menu_vals,template="(%s,%s,%s,%s)")
            row_count=cursor.rowcount
            self.logger.debug(f'Bulk Insert Success with {row_count} row(s)  ID {self.role_id} at time {self.created_date}')
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"roleId":self.role_id,"rowCount":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While add_menus_to_role {error}')
                raise