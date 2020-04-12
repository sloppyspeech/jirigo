from .jirigo_dbconn_service import JirigoDBConn
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoUsers(object):

    def __init__(self,data):
        print("Initializing JirigoUsers")
        pprint(data)
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.is_active = data['is_active']
        self.salt = data['salt']
        self.password = data['password']
        self.created_by = data['created_by']
        self.created_date = data['created_date']
        self.modified_by = None
        self.modified_date = None
        self.is_active = data['is_active']

        self.jdb=JirigoDBConn()


    def create_user(self):
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
            print(f'Insert Success with {row_count} row(s) User ID {user_id}')
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Project {error}')