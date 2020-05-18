from flask import jsonify
from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger

import psycopg2
import datetime
from hashlib import pbkdf2_hmac
import random,string

from pprint import pprint

class JirigoUsers(object):

    def __init__(self,data):
        print("Initializing JirigoUsers")
        self.user_id=data.get('user_id',0)
        self.first_name = data.get('first_name','')
        self.last_name = data.get('last_name','')
        self.email = data.get('email','')
        self.is_active = data.get('is_active','')
        self.salt = data.get('salt','')
        self.password = data.get('password','')
        self.created_by = data.get('created_by','')
        self.created_date = datetime.datetime.now()
        self.modified_by = None
        self.modified_date = None
        self.is_active = data.get('is_active','')
        self.assigned_projects=data.get('assigned_projects',[])
        self.role_id=data.get('role_id','')
        self.project_id=data.get('project_id','')
        self.current_route=data.get('current_route','')
        self.jdb=JirigoDBConn()
        self.logger=Logger()

    
    @classmethod
    def for_create_update_users(cls,data):
        print("-"*40)
        print(f'In  for_create_update_users  :{data}')
        print("-"*40)
        return cls(data)

    def register_user(self):
        response_data={}
        print("Inside Create User")
        self.salt=JirigoUsers.generate_salt()
        insert_sql="""  INSERT INTO TUSERS(first_name,last_name,email,salt,password,
                        created_by,created_date,is_active) 
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s) returning user_id;
                    """
        values=(self.first_name,self.last_name,self.email,self.salt,JirigoUsers.get_password_digest(self.password,self.salt),1,datetime.datetime.today(),self.is_active,)
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
                raise

    def create_user(self):
        response_data={}
        print("Inside Create User")
        self.salt=JirigoUsers.generate_salt()
        insert_sql="""  INSERT INTO TUSERS(first_name,last_name,email,salt,password,
                        created_by,created_date,is_active) 
                        VALUES (%s,%s,%s,%s,%s,%s,%s,%s) returning user_id;
                    """
        values=(self.first_name,self.last_name,self.email,self.salt,JirigoUsers.get_password_digest(self.password,self.salt),1,datetime.datetime.today(),self.is_active,)
        print(f'Insert : {insert_sql}  {values}')

        add_user_projects_sql="""
                                INSERT INTO TUSER_PROJECTS 
                                        (user_id,project_id,created_date,created_by,is_active,default_project)
                                VALUES  (%s,%s,%s,%s,%s,%s);
                            """
        try:
            print('-'*80)
            print(type(self.jdb.dbConn))
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)
            user_id=cursor.fetchone()[0]
            print(f'self.assigned_projects {self.assigned_projects}')
            print(f'User id is {user_id}')
            default_project='Y'
            for i in range(len(self.assigned_projects)):
                print(f'Inserting project id {self.assigned_projects[i]}')
                values=(user_id,self.assigned_projects[i],self.created_date,self.created_by,'Y',default_project,)
                print(f'TUSER_PROJECTS Insert : {add_user_projects_sql}  {values}')
                cursor.execute(add_user_projects_sql,values)
                default_project='N'

            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            print(f'User Creation Success with {row_count} row(s) User ID {user_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']={"userId":user_id,"rowCount":1}
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating User {error}')
            raise
    
    def get_all_users(self):
        response_data={}
        self.logger.debug("Inside get_all_users")
        query_sql="""  
                    WITH t AS (
                    select first_name,last_name,user_id,get_user_name(user_id) as name,email,
                            is_active,password_change_date
                      from tusers 
                      order by first_name
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
    
    def validate_userid_password(self):
        response_data={}
        self.logger.debug("Inside validate_userid_password")
        try:
            salt=self.get_user_salt()
        except Exception as error:
            print("Error while retrieving user Salt")
            response_data['dbQryStatus']='Failure'
            response_data['dbQryResponse']='Invalid User Id or Password'
            return response_data

        print(f'User Salt is {salt}')
        query_sql="""  
                 WITH t AS (
                    SELECT  tu.user_id,get_user_name(tu.user_id) as user_name,
                            tu.email,tu.is_active,coalesce(tup.project_id,0) project_id,
                            get_proj_name(tup.project_id) project_name,
                            get_role_id_for_user(tu.user_id,tup.project_id) role_id,
                            get_role_name(get_role_id_for_user(tu.user_id,tup.project_id)) role_name
                      FROM tusers tu
                     LEFT OUTER JOIN tuser_projects tup
                        ON tu.user_id = tup.user_id 
                     WHERE tu.email=%s
                       AND tu.password=%s
                       AND COALESCE (tup.default_project,'Y') ='Y'
                    )
                    SELECT json_agg(t) from t;
                   """

        values=(self.email,JirigoUsers.get_password_digest(self.password,salt),)
        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select validate_password Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='Failure'
                response_data['dbQryResponse']='Invalid User Id or Password'
            else:
                self.logger.debug(f'json_data[0] {json_data[0]}')
                if (json_data[0]['is_active'] != 'Y'):
                    response_data['dbQryStatus']='Failure'
                    response_data['dbQryResponse']='Inactive User, Contact Administrator.'
                elif (json_data[0]['project_id'] == 0):
                    response_data['dbQryStatus']='Failure'
                    response_data['dbQryResponse']='Active User, but no Project Assigned. Contact Adminstrator.'
                else:
                    response_data['dbQryStatus']='Success'
                    response_data['dbQryResponse']=json_data

            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select validate_password {error}')
                raise
    

    def set_user_password(self):
        response_data={}
        self.logger.debug("Inside set_password")

        update_sql="""
                        UPDATE TUSERS 
                           SET  password=%s,
                                salt=%s,
                                modified_by=%s,
                                modified_date=%s,
                                password_change_date=%s
                         WHERE  (user_id=%s 
                                 OR email=%s)
                    """
        salt=JirigoUsers.generate_salt()
        
        values=(JirigoUsers.get_password_digest(self.password,salt),salt,self.modified_by,
                datetime.datetime.now(),datetime.datetime.now(),self.user_id,self.email,)

        self.logger.debug(f'set_password : {update_sql}  {values}')

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
            print(f'Error While set_user_password{error}')
            raise

    def get_user_salt(self):
        response_data={}
        self.logger.debug("Inside get_user_names")
        query_sql="""
                    select salt
                      from tusers
                      WHERE ( email=%s
                             OR user_id=%s )
                    """
        values=(self.email,self.user_id,)

        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select get_user_salt Success with {row_count} row(s) data {data}')
            return data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select get_user_salt {error}')
            raise

    def authenticate_route_for_user(self):
        response_data={}
        self.logger.debug("Inside authenticate_route_for_user")

        query_sql="""  
                 WITH t AS (
                        SELECT * 
                          FROM v_user_projects_role_menu vuprm 
                         WHERE vuprm.project_id =%s
                           AND user_id=%s
                           AND role_id=%s
                           AND ( menu_url=%s or path = %s )
                    )
                    SELECT json_agg(t) from t;
                   """

        values=(self.project_id,self.user_id,self.role_id,self.current_route,self.current_route,)
        self.logger.debug(f'Select : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            print("=^^="*30)
            print(json_data)
            print("=^^="*30)
            row_count=cursor.rowcount
            self.logger.debug(f'Select authenticate_route_for_user Success with {row_count} row(s) data {json_data}')
            if (json_data == None):
                response_data['dbQryStatus']='Failure'
                response_data['dbQryResponse']='Access Denied To Current Route'
            else:
                self.logger.debug(f'json_data[0] {json_data[0]}')
                response_data['dbQryStatus']='Success'
                response_data['dbQryResponse']='Access Granted'

            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Select authenticate_route_for_user {error}')
                raise

    @staticmethod
    def get_password_digest(p_password,salt,iterations=1000000,dklen=64):
        # print(f'{p_password}  {p_password.encode()}  {bytes(p_password,"utf-8")}')
        return pbkdf2_hmac('sha512',p_password.encode(),salt.encode(),iterations,dklen)

    @staticmethod
    def generate_salt(salt_len=20):
        return  ''.join([random.choice(string.ascii_letters+string.digits+string.punctuation) for x in range(salt_len)])