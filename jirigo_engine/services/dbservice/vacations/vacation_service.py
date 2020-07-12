from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoVacations(object):

    def __init__(self,data={}):
        print("Initializing JirigoVacations")
        print(f'In for Create/Update/Delete vacations ****')
        pprint(data)
        self.project_id = data.get('project_id')
        self.vacation_id = data.get('vacation_id')
        self.user_id = data.get('user_id')
        self.start_date = data.get('start_date')
        self.end_date = data.get('end_date')
        self.input_date = data.get('input_date')
        self.description = data.get('description')
        self.created_date=datetime.datetime.now()
        self.modified_date=datetime.datetime.now()
        self.jdb=JirigoDBConn()

        self.logger=Logger()


    def get_all_vacations_for_user(self):
        response_data={}
        self.logger.debug("Inside get_all_vacations_for_user")
        query_sql="""  
                    with t as (
                                SELECT * 
                                  FROM tvacations
                                 WHERE user_id=%s
                    )
                    select json_agg(t) from t ;
                   """
        self.logger.debug(f'Select all vacation : {query_sql}')
        values=(self.user_id,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_vacations_for_user Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data if json_data != None else 'No Rows Fetched'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_vacations_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_vacations_for_user {error}')
                raise
    
    def get_vacation_for_user_by_timerange(self):
        response_data={}
        self.logger.debug("Inside get_vacation_for_user_by_timerange")
        query_sql="""  
                    with t as (
                                SELECT * 
                                  FROM tvacations
                                 WHERE user_id=%s
                                   AND %s between start_date and end_date
                    )
                    select json_agg(t) from t ;
                   """
        values=(self.user_id,self.input_date,)
        self.logger.debug(f'Select all vacation : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_vacation_for_user_by_timerange Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_vacation_for_user_by_timerange {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_vacation_for_user_by_timerange {error}')
                raise
   
    def get_all_vacations_by_timerange(self):
        response_data={}
        self.logger.debug("Inside get_all_vacations_by_timerange")
        query_sql="""  
                    with t as (
                                SELECT vacation_id,
                                       user_id,
                                       get_user_name(user_id),
                                       start_date,
                                       end_date,
                                       description
                                  FROM tvacations
                                 WHERE start_date >=%s
                                   and end_date <=%s
                    )
                    select json_agg(t) from t ;
                   """
        values=(self.start_date,self.end_date,)
        self.logger.debug(f'Select all vacation : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_vacations_by_timerange Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_vacations_by_timerange {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_vacations_by_timerange {error}')
                raise

    def cre_vacation_for_user_by_timerange(self):
        response_data={}
        self.logger.debug("Inside cre_vacation_for_user_by_timerange")
        query_sql="""  
                    INSERT INTO 
                            tvacations (user_id,start_date,end_date,description,created_date)
                        VALUES (%s,%s,%s,%s,%s)
                        RETURNING vacation_id
                          
                   """
        self.logger.debug(f'Select all vacation : {query_sql}')
        values=(self.user_id,self.start_date,self.end_date,self.description,self.created_date,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            self.jdb.dbConn.commit()
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'cre_vacation_for_user_by_timerange Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Vacation Created '+str(json_data)
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While  cre_vacation_for_user_by_timerange {error}')
            if(self.jdb.dbConn):
                print(f'Error While cre_vacation_for_user_by_timerange {error}')
                raise

    def del_vacation_for_user(self):
        response_data={}
        self.logger.debug("Inside del_vacation_for_user")
        query_sql="""  
                    DELETE FROM tvacations WHERE VACATION_ID=%s
                          
                   """
        self.logger.debug(f'Select all vacation : {query_sql}')
        values=(self.vacation_id)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            row_count=cursor.rowcount
            self.logger.debug(f'del_vacation_for_user Select Success with {row_count} row(s) data')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Record Deleted'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference del_vacation_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference del_vacation_for_user {error}')
                raise
    
    def upd_vacation_for_user(self):
        response_data={}
        self.logger.debug("Inside del_vacation_for_user")
        query_sql="""  
                    UPDATE tvacations
                        SET start_date=%s,
                            end_date=%s,
                            description=%s,
                            modified_date=%s
                        WHERE vacation_id=%s
                   """
        values=(self.start_date,self.end_date,self.description,self.modified_date,self.vacation_id,)
        self.logger.debug(f'Select all vacation : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            row_count=cursor.rowcount
            self.logger.debug(f'del_vacation_for_user Select Success with {row_count} row(s) data')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Record Deleted'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference del_vacation_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference del_vacation_for_user {error}')
                raise
    

    def check_vacation_overlap(self):
        response_data={}
        self.logger.debug("Inside check_vacation_overlap")
        query_sql="""  
                    with t as (
                                SELECT * 
                                  FROM tvacations
                                 WHERE user_id=%s
                                   AND %s between start_date and end_date
                    )
                    select json_agg(t) from t ;
                   """
        values=(self.user_id,self.input_date,)
        self.logger.debug(f'Select all vacation : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'check_vacation_overlap Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference check_vacation_overlap {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference check_vacation_overlap {error}')
                raise