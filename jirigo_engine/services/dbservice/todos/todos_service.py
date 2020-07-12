from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
import datetime

from pprint import pprint

class JirigoTodos(object):

    def __init__(self,data={}):
        print("Initializing JirigoTodos")
        print(f'In for Create/Update/Delete todos ****')
        pprint(data)
        self.project_id = data.get('project_id')
        self.user_id = data.get('user_id')
        self.todo_id = data.get('todo_id')
        self.label_id = data.get('label_id')
        self.todo_label = data.get('todo_label')
        self.end_date = datetime.datetime.now() if data.get('end_date') == None else data.get('end_date') 
        self.todo_text = data.get('todo_text')
        self.todo_status= data.get('todo_status')
        self.category_id= data.get('category_id')
        self.category= data.get('category')
        self.category_color= data.get('category_color')
        self.created_by= data.get('created_by')
        self.modified_by= data.get('modified_by')
        self.interval_days=data.get('interval_days')
        self.created_date=datetime.datetime.now()
        self.modified_date=datetime.datetime.now()
        self.jdb=JirigoDBConn()

        self.logger=Logger()


    def get_all_todos_for_user(self):
        response_data={}
        self.logger.debug("Inside get_all_todos_for_user")
        query_sql="""  
                    with t as (
                               SELECT * 
                                 FROM v_all_todos_with_labels
                                WHERE created_by=%s
                    )
                    select json_agg(t) from t ;
                   """
        self.logger.debug(f'Select all todos : {query_sql}')
        values=(self.user_id,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_todos_for_user Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data if json_data != None else 'No Rows Fetched'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_todos_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_todos_for_user {error}')
                raise
    
    def get_all_todos_for_user_filtered_by_label(self):
        response_data={}
        self.logger.debug("Inside get_all_todos_for_user_filtered_by_label")
        query_sql="""  
                    with t as (
                               SELECT * 
                                 FROM v_all_todos_with_labels
                                WHERE created_by=%s
                                  AND label_id=%s
                    )
                    select json_agg(t) from t ;
                   """
        self.logger.debug(f'Select all todos : {query_sql}')
        values=(self.user_id,self.label_id,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_all_todos_for_user_filtered_by_label Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data if json_data != None else 'No Rows Fetched'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_all_todos_for_user_filtered_by_label {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_all_todos_for_user_filtered_by_label {error}')
                raise
    
    def get_todos_for_user_by_interval(self):
        response_data={}
        self.logger.debug("Inside get_todos_for_user_by_interval")
        query_sql="""  
                    with t as (
                                SELECT
                                    td.*,ttc.*
                                FROM
                                    ttodos td
                                LEFT OUTER JOIN ttodo_categories ttc 
                                ON td.category_id=ttc.category_id
                                WHERE
                                    td.created_by =%s
                                    AND DATE(end_date) between  DATE(now()) AND DATE(now()) + INTERVAL %s 
                                ORDER BY
                                    td.created_date DESC,
                                    td.modified_date DESC
                    )
                    select json_agg(t) from t ;
                   """
        self.interval_days= f'{self.interval_days} days' if int(self.interval_days) > 1 else f'{self.interval_days} day'
        values=(self.user_id,self.interval_days,)
        self.logger.debug(f'Select all todos : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_todos_for_user_by_interval Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_todos_for_user_by_interval {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_todos_for_user_by_interval {error}')
                raise
   
    def get_todo_categories_for_user(self):
        response_data={}
        self.logger.debug("Inside get_todo_categories_for_user")
        query_sql="""  
                    with t as (
                                SELECT * 
                                  FROM ttodo_categories
                                 WHERE user_id=%s
                                  ORDER BY category
                    )
                    select json_agg(t) from t ;
                   """
        values=(self.user_id,)
        self.logger.debug(f'Select all todos : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_todo_categories_for_user Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_todo_categories_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_todo_categories_for_user {error}')
                raise

    def create_todo_for_user(self):
        response_data={}
        self.logger.debug("Inside create_todo_for_user")
        query_sql="""  
                    INSERT INTO 
                            ttodos (todo_text,todo_status,category_id,end_date,created_by,created_date)
                        VALUES (%s,%s,%s,%s,%s,%s)
                        RETURNING todo_id
                          
                   """
        self.logger.debug(f'Select all todos : {query_sql}')
        values=(self.todo_text,self.todo_status,self.category_id,self.end_date,self.created_by,self.created_date,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            self.jdb.dbConn.commit()
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'create_todo_for_user Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Todo Created '+str(json_data)
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While  create_todo_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While create_todo_for_user {error}')
                raise

    def create_category_for_user(self):
        response_data={}
        self.logger.debug("Inside create_category_for_user")
        query_sql="""  
                    INSERT INTO 
                            ttodo_categories (category,user_id,colorhex)
                        VALUES (%s,%s)
                        RETURNING category_id
                          
                   """
        self.logger.debug(f'Create Category : {query_sql}')
        values=(self.category,self.user_id,self.category_color,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            self.jdb.dbConn.commit()
            json_data=cursor.fetchone()[0]
            print(json_data)
            row_count=cursor.rowcount
            self.logger.debug(f'create_category_for_user Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Category Created '+str(json_data)
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While  create_category_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While create_category_for_user {error}')
                raise

    def del_todo_for_user(self):
        response_data={}
        self.logger.debug("Inside del_todo_for_user")
        query_sql="""  
                    DELETE FROM ttodos WHERE todo_id=%s
                   """
        values=(self.todo_id,)
        self.logger.debug(f'Select all todos : {query_sql} {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'del_todo_for_user Select Success with {row_count} row(s) data')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=f'{row_count} Record Deleted'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While  del_todo_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While del_todo_for_user {error}')
                raise
    
    def upd_todo_for_user(self):
        response_data={}
        self.logger.debug("Inside upd_todo_for_user")
        query_sql="""  
                    UPDATE ttodos
                        SET todo_text=%s,
                            end_date=%s,
                            todo_status=%s,
                            category_id=%s,
                            modified_by=%s,
                            modified_date=%s
                        WHERE todo_id=%s
                   """
        values=(self.todo_text,self.end_date,self.todo_status,self.category_id,self.modified_by,self.modified_date,self.todo_id,)
        self.logger.debug(f'Select all todos : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'upd_todo_for_user Success with {row_count} row(s) data')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=f'{row_count} Record Updated'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference upd_todo_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference upd_todo_for_user {error}')
                raise
    
    def upd_category_for_user(self):
        response_data={}
        self.logger.debug("Inside upd_category_for_user")
        query_sql="""  
                    UPDATE ttodo_categories
                       SET  category=%s,
                            colorhex=%s
                     WHERE category_id=%s

                   """
        self.logger.debug(f'Select all todos : {query_sql}')
        values=(self.category,self.category_color,self.category_id,)
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            row_count=cursor.rowcount
            self.jdb.dbConn.commit()
            self.logger.debug(f'upd_category_for_user Select Success with {row_count} row(s) data')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Record Updated'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference upd_category_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference upd_category_for_user {error}')
                raise

    def create_label_for_todo(self):
        response_data={}
        row_count=0
        self.logger.debug("Inside create_label_for_todo")
        label_sql="""  
                    INSERT INTO 
                            ttodo_labels (label)
                        VALUES (%s)
                        RETURNING label_id
                          
                   """

        label_todo_link_sql="""  
                    INSERT INTO 
                            ttodo_label_link (label_id,todo_id)
                        VALUES (%s,%s)
                   """
        self.logger.debug(f'Create Label : {label_sql}')
        
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()

            # 
            if self.label_id == "":
                values=(self.todo_label,)
                cursor.execute(label_sql,values)
                self.jdb.dbConn.commit()
                label_id=cursor.fetchone()[0]
                row_count=cursor.rowcount
            else :
                label_id=self.label_id

            values=(label_id,self.todo_id,)
            print(values)
            cursor.execute(label_todo_link_sql,values)
            self.jdb.dbConn.commit()
            self.logger.debug(f'create_label_for_todo Success with {row_count} row(s) data {label_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Label Created with id :'+str(label_id)
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While  create_label_for_todo {error}')
            if(self.jdb.dbConn):
                print(f'Error While create_label_for_todo {error}')
                raise
    
    def get_todo_labels_for_user(self):
        response_data={}
        self.logger.debug("Inside get_todo_labels_for_user")
        query_sql="""  
                    with t as (
                                SELECT
                                    distinct 
                                    tl.label,tl.label_id
                                FROM
                                    ttodo_label_link tll ,
                                    ttodo_labels tl,
                                    ttodos t
                                WHERE
                                    tll.label_id = tl.label_id
                                    AND t.todo_id = tll.todo_id
                                    AND t.created_by = %s
                    )
                    select json_agg(t) from t ;
                   """
        values=(self.user_id,)
        self.logger.debug(f'Select all todos : {query_sql} Values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'get_todo_labels_for_user Select Success with {row_count} row(s) data {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While Select Reference get_todo_labels_for_user {error}')
            if(self.jdb.dbConn):
                print(f'Error While Select Reference get_todo_labels_for_user {error}')
                raise

    def del_label_for_todo(self):
        response_data={}
        self.logger.debug("Inside create_label_for_todo")
        label_sql="""  
                    CALL del_todo_label(%s,%s);
                   """
        self.logger.debug(f'Delete Label : {label_sql}')
        
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            values=(self.label_id,self.todo_id,)
            cursor.execute(label_sql,values)
            self.jdb.dbConn.commit()
            self.logger.debug(f'create_label_for_todo Success with row(s) data {self.label_id}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']='Label Deleted'
            print(response_data)
            return response_data
        except  (Exception, psycopg2.Error) as error:
            print(f'Error While  create_label_for_todo {error}')
            if(self.jdb.dbConn):
                print(f'Error While create_label_for_todo {error}')
                raise