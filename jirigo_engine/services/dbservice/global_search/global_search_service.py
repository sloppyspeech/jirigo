from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from flask import jsonify

import psycopg2
from psycopg2.extras import execute_values
import datetime

from pprint import pprint

class JirigoGlobalSearch(object):
    def __init__(self,data={}):
        print("Initializing JirigoGlobalSearch")
        print(f'In for JirigoGlobalSearch **** :{data}')
        self.search_text=data.get('search_text')
        self.created_by = data.get('created_by')
        self.created_date = datetime.datetime.now()
        self.modified_by=data.get('modified_by')
        self.modified_date=datetime.datetime.now()

        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def global_search(self):
        response_data={}
        self.logger.debug(" Inside global_search")
        query_sql="""  
                        WITH tc AS (SELECT item_no,summary,item_type
                                      FROM v_all_tickets_tasks vatt 
                                     WHERE to_tsvector(item_no||'-'||summary||description) @@ plainto_tsquery (%s) 
                                     LIMIT 5
                      ) 
                        select json_agg(tc) from tc;

                   """
        values=(self.search_text,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            json_data=cursor.fetchone()[0]
            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) global_search  {json_data}')
            response_data['dbQryStatus']='Success'
            response_data['dbQryResponse']=json_data
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While global_search {error}')
                raise