from flask import jsonify
from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger

import psycopg2
import datetime

from pprint import pprint

class JirigoUsers(object):

    def __init__(self,data):
        print("Initializing JirigoUsers")
        pprint(data)
        self.user_id=data.get('user_id','')
        self.first_name = data.get('first_name','')
        self.last_name = data.get('last_name','')
        self.email = data.get('email','')
        self.is_active = data.get('is_active','')
        self.salt = data.get('salt','')
        self.password = data.get('password','')
        self.created_by = data.get('created_by','')
        self.created_date = data.get('created_date','')
        self.modified_by = None
        self.modified_date = None
        self.is_active = data.get('is_active','')
        self.jdb=JirigoDBConn()
        self.logger=Logger()

    
    @classmethod
    def for_create_update_users(cls,data):
        print("-"*40)
        print(f'In  for_create_update_users  :{data}')
        print("-"*40)
        return cls(data)

    def create_user(self):
        response_data={}
        print("Inside Create User")
        insert_sql="""  INSERT INTO TUSERS(first_name,last_name,email,salt,password,
                        created_by,created_date,is_active) 
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s) returning user_id;
                    """
        values=(self.first_name,self.last_name,self.email,self.salt,self.password,1,datetime.datetime.today(),self.is_active,)
        print(f'Insert : {insert_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            user_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            print(f'User Creation Success with {row_count} row(s) User ID {user_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"userId":user_id,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating User {error}')

    
    def get_all_users(self):
        response_data={}
        self.logger.debug("Inside get_all_users")
        query_sql="""  
                    WITH t AS (
                    select user_id,get_user_name(user_id) as name,email
                        from tusers 
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
            self.logger.debug(f'Select Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select Users {error}')
                raise
    
    def get_user_details(self):
        response_data={}
        self.logger.debug("Inside get_all_users")
        query_sql="""  
                    WITH t AS (
                    select user_id,first_name||'.'||last_name as name,email
                        from tusers 
                    where is_active='Y'
                      and user_id=%s
                    )
                    SELECT json_agg(t) from t;
                   """
        values=(self.user_id,)
        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select get_user_details Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select get_user_details {error}')
                raise

    def get_user_names(self,user_name):
        response_data={}
        self.logger.debug("Inside get_user_names")
        query_sql="""  
                    WITH t AS (
                    select user_id,get_user_name(user_id) as name,email
                        from tusers 
                    where is_active='Y'
                      and lower(first_name||'.'||last_name) like lower(%s)
                    )
                    SELECT json_agg(t) from t;
                   """
        user_name=str(user_name).replace('%','####')
        values=(f'{user_name}%',)
        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select get_user_names Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='No Data Found'
            else:
                response_data['dbQryStatus']='Success'

            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select get_user_names {error}')
                raise


    def update_user_details(self):
        response_data={}
        self.logger.debug("Inside update_user_details")

        update_sql="""
                        UPDATE TUSERS 
                           SET  first_name=%s,
                                last_name=%s,
                                email=%s,
                                modified_by=%s,
                                modified_date=%s
                         WHERE  user_id=%s;
                    """
        values=(self.first_name,self.last_name,self.email,self.modified_by,
                datetime.datetime.today(),self.user_id,)

        self.logger.debug(f'update_user_details : {update_sql}  {values}')

        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(update_sql,values)
            self.jdb.dbConn.commit()
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"rowUpdateCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Updating Ticket {error}')
                raise