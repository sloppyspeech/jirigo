from .jirigo_dbconn_service import JirigoDBConn
from services.logging.logger import Logger
import json
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoRefMaster(object):

    def __init__(self):
        self.jdb=JirigoDBConn()
        self.logger=Logger()
    

    def get_status_values(self):
        response_data={}
        self.logger.debug("Inside get_all_tickets")
        query_sql="""  
                    WITH t AS (
                            select
                                ref_value
                            from
                                tref_master
                            where
                                ref_category = 'TICKETS'
                                and is_active = 'Y'
                                and ref_name = 'STATUS'
                                order by order_id
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
                                and ref_name = 'PRIORITY'
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        self.logger.debug(f'Select Priority : {query_sql}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
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
                                and ref_name = 'SEVERITY'
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        self.logger.debug(f'Select SEVERITY : {query_sql}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
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
                                and ref_name = 'ISSUE_TYPE'
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        self.logger.debug(f'Select ISSUE_TYPE : {query_sql}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'ISSUE_TYPE Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference ISSUE_TYPE {error}')
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
                                and ref_name = 'ISSUE_TYPE'
                                order by order_id
                        )
                        SELECT json_agg(t) from t;
                   """
        self.logger.debug(f'Select ISSUE_TYPE : {query_sql}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'ISSUE_TYPE Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Reference ISSUE_TYPE {error}')
                raise
    
    def get_all_ticket_refs(self):
        response_data={}
        self.logger.debug("Inside get_issue_type_values")
        query_sql="""  
                        with t as (
                        select
                                json_build_object( t.ref_name , json_agg( json_build_object( 'name', t.ref_value) ) ) refs
                            from
                                (
                                select
                                    case when REF_NAME='Environment' then 'Environments'
                                        when REF_NAME='ISSUE_TYPE' then 'IssueTypes'
                                        when REF_NAME='PRIORITY' then 'Priorities'
                                        when REF_NAME='SEVERITY' then 'Severities'
                                        when REF_NAME='STATUS' then 'IssueStatuses'
                                    end REF_NAME ,
                                    ref_value
                                from
                                    tref_master
                                where
                                    ref_category = 'TICKETS'
                                    and is_active = 'Y'
                                order by
                                    ref_name,
                                    order_id )t
                            group by
                                t.ref_name 
                        )
                        select json_build_object('rowData',json_agg(t.refs)) from t ;
                   """
        self.logger.debug(f'Select all ticket_refs : {query_sql}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_ticket_refs Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data['rowData']
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_ticket_refs {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_ticket_refs {error}')
                raise