from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
import json
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoRefMaster(object):

    def __init__(self,data={}):
        self.project_id=data.get('project_id',0)
        self.project_name=data.get('project_name',0)
        self.ref_category=data.get('ref_category',None)
        self.ref_name=data.get('ref_name',None)
        self.ref_value=data.get('ref_value',None)
        self.ref_id=data.get('ref_id',None)
        self.is_active=data.get('is_active',None)
        self.created_by=data.get('created_by',1)
        self.created_date = datetime.datetime.now()
        self.modified_by=data.get('modified_by',1)
        self.modified_date = datetime.datetime.now()
        self.jdb=JirigoDBConn()
        self.logger=Logger()
    

    def get_status_values(self):
        response_data={}
        self.logger.debug("Inside get_status_values")
        query_sql="""  
                    WITH t AS (
                            select
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'TICKETS'
                                and is_active = 'Y'
                                and ref_name = 'Status'
                                and project_id=%s
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference Status {error}')
                raise

    def get_priority_values(self):
        response_data={}
        self.logger.debug("Inside get_priority_values")
        query_sql="""  
                    WITH t AS (
                            select
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'TICKETS'
                                and is_active = 'Y'
                                and ref_name = 'Priority'
                                and project_id=%s
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Priority Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference Priority {error}')
                raise


    def get_severity_values(self):
        response_data={}
        self.logger.debug("Inside get_severity_values")
        query_sql="""  
                    WITH t AS (
                            select
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'TICKETS'
                                and is_active = 'Y'
                                and ref_name = 'Severity'
                                and project_id=%s
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Severity Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference Severity {error}')
                raise
    

    def get_issue_type_values(self):
        response_data={}
        self.logger.debug("Inside get_issue_type_values")
        query_sql="""  
                    WITH t AS (
                            select
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'TICKETS'
                                and is_active = 'Y'
                                and ref_name = 'Issue Type'
                                and project_id=%s
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Issue Type Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference Issue Type {error}')
                raise
    
    def get_module_values(self):
        response_data={}
        self.logger.debug("Inside get_module_values")
        query_sql="""  
                    WITH t AS (
                            select
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'TICKETS'
                                and is_active = 'Y'
                                and ref_name = 'Module'
                                and project_id = %s
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Module Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference Module {error}')
                raise
    
    def get_all_ticket_refs(self):
        response_data={}
        self.logger.debug("Inside get_all_ticket_refs")
        query_sql="""  
                        with t as (
                        select
                                t.ref_name , json_agg( json_build_object( 'name', t.ref_value) )  refs
                            from
                                (
                                select
                                    case when REF_NAME='Environment' then 'Environments'
                                        when REF_NAME='Issue Type' then 'IssueTypes'
                                        when REF_NAME='Priority' then 'Priorities'
                                        when REF_NAME='Severity' then 'Severities'
                                        when REF_NAME='Status' then 'IssueStatuses'
                                        when REF_NAME='Module' then 'Modules'
                                        else REF_NAME
                                    end REF_NAME ,
                                    ref_value
                                from
                                    tref_master
                                where
                                    ref_category = 'TICKETS'
                                    and is_active = 'Y'
                                    and project_id=%s
                                order by
                                    ref_name,
                                    order_id )t
                            group by
                                t.ref_name 
                        )
                        select json_object_agg(t.ref_name,t.refs) from t ;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_ticket_refs Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_ticket_refs {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_ticket_refs {error}')
                raise

    def get_all_task_refs(self):
        response_data={}
        self.logger.debug("Inside get_all_task_refs")
        query_sql="""  
                        with t as (
                        select
                                t.ref_name , json_agg( json_build_object( 'name', t.ref_value) )  refs
                            from
                                (
                                select
                                    case when REF_NAME='Environment' then 'Environments'
                                        when REF_NAME='Issue Type' then 'IssueTypes'
                                        when REF_NAME='Priority' then 'Priorities'
                                        when REF_NAME='Severity' then 'Severities'
                                        when REF_NAME='Status' then 'IssueStatuses'
                                        when REF_NAME='Module' then 'Modules'
                                        else REF_NAME
                                    end REF_NAME ,
                                    ref_value
                                from
                                    tref_master
                                where
                                    ref_category = 'TASKS'
                                    and is_active = 'Y'
                                    and project_id=%s
                                order by
                                    ref_name,
                                    order_id )t
                            group by
                                t.ref_name 
                        )
                        select json_object_agg(t.ref_name,t.refs) from t ;
                        
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print("*"*56)
            print(json_data)
            print("*"*56)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_task_refs Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_task_refs {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_task_refs {error}')
                raise

    def get_all_sprint_refs(self):
        response_data={}
        self.logger.debug("Inside get_all_sprint_refs")
        query_sql="""  
                    with t as (
                    select
                            t.ref_name , json_agg( json_build_object( 'name', t.ref_value) )  refs
                        from
                            (
                            select
                                case when REF_NAME='Environment' then 'Environments'
                                    when REF_NAME='Issue Type' then 'IssueTypes'
                                    when REF_NAME='Priority' then 'Priorities'
                                    when REF_NAME='Severity' then 'Severities'
                                    when REF_NAME='Status' then 'SprintStatuses'
                                    when REF_NAME='Module' then 'Modules'
                                end REF_NAME ,
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'SPRINT'
                                and is_active = 'Y'
                                and project_id=%s
                            order by
                                ref_name,
                                order_id )t
                        group by
                            t.ref_name 
                    )
                    select json_object_agg(t.ref_name,t.refs) from t ;
                   """
        values=(self.project_id,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_sprint_refs Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_sprint_refs {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_sprint_refs {error}')
                raise


    def get_all_refs_for_show_and_editing(self):
        response_data={}
        self.logger.debug("Inside get_all_refs_for_editing")
        query_sql="""  
                        SELECT 
                        json_agg(t2) 
                        FROM 
                        (
                            SELECT 
                            json_agg(t1) all_refs 
                            FROM 
                            (
                                SELECT 
                                get_proj_name(project_id) project_name, 
                                ref_category, 
                                ref_name, 
                                ref_id, 
                                ref_value, 
                                project_id, 
                                is_active, 
                                order_id 
                                FROM 
                                tref_master 
                                ORDER BY 
                                1, 
                                2, 
                                3
                            ) t1 
                            GROUP BY 
                            ref_category, 
                            ref_name 
                        ) t2
                   """
        # self.ref_category = None if self.ref_category == '' else self.ref_category
        # self.ref_name = None if self.ref_name == '' else self.ref_name
        # self.project_id = None if self.project_id == '' else self.project_id

        values=(self.project_id,self.ref_category,self.ref_name,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_refs_for_editing Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=[json_data]
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error In get_all_refs_for_editing {error}')
                raise
    
    def get_all_reference_categories(self):
        response_data={}
        self.logger.debug("Inside get_all_refs_for_editing")
        query_sql="""  
                    WITH t AS (
                            SELECT
                                ref_category
                            FROM 
                                tref_master
                            WHERE project_id=coalesce(%s,project_id)
                        )
                        SELECT json_agg(t) from t;
                   """
        self.project_id = None if self.project_id == '' else self.project_id

        values=(self.project_id,self.ref_category,self.ref_name,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_refs_for_editing Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error In get_all_refs_for_editing {error}')
                raise
    
    def insert_reference(self):
        response_data={}
        self.logger.debug("insert_reference")
        insert_refs_sql="""
                            INSERT 
                              INTO tref_master
                                    (ref_category,ref_name,ref_value,
                                     is_active,created_by,created_date,
                                     order_id,
                                     project_id)
                             VALUES (
                                     %s,%s,%s,%s,%s,%s,
                                     (
                                        SELECT coalesce(max(ref_id),0)+1
                                          FROM tref_master
                                         WHERE ref_category=%s 
                                           AND ref_name=%s
                                           AND ref_value=%s
                                           AND project_id=get_proj_id(%s)
                                              ),
                                    get_proj_id(%s)
                             ) returning ref_id;
                            """
        values=( self.ref_category,self.ref_name,self.ref_value,
                        self.is_active,self.created_by,self.created_date,
                        self.ref_category,self.ref_name,self.ref_value,self.project_name,
                        self.project_name,
                        )
        print(f' {insert_refs_sql}  values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_refs_sql,values)
            ref_id=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s) REF ID {ref_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"Refs":ref_id,"No Of Rows Inserted":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
                print(f'Error While Updating insert_reference  {error}')
                raise
    
    def update_reference(self):
        response_data={}
        self.logger.debug("update_reference")
        update_refs_sql="""

                            UPDATE tref_master
                                    set ref_value=%s,
                                        modified_by=%s,
                                        modified_date=%s
                              WHERE ref_id=%s;

                            """
        values=( self.ref_value,self.modified_by,self.modified_date,self.ref_id,)
        print(f' {update_refs_sql}  values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(update_refs_sql,values)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'Insert Success with {row_count} row(s) REF ID {self.ref_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"Refs":self.ref_id,"No Of Rows Updated":row_count}
            return response_data
        except  (Exception, psycopg2.Error) as error:
                print(f'Error While Updating update_reference  {error}')
                raise