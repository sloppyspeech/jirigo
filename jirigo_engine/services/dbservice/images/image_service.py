from flask import jsonify
import psycopg2
import datetime
import time
import os

from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger

from pprint import pprint

class JirigoImages(object):
    def __init__(self,data):
        self.image_name=data.get('image_name')
        self.image_display_name=data.get('image_display_name')
        self.image_uuid=data.get('image_uuid')
        self.created_by=data.get('created_by','0')
        self.created_date=datetime.datetime.now()
        self.jdb=JirigoDBConn()
        self.logger=Logger()

    def save_image_metadata_to_db(self):
        response_data={}
        rows=[]
        self.logger.debug("Inside create_link ")
        insert_sql="""  INSERT INTO 
                        timages( image_uuid,image_name,image_display_name,created_by,created_date) 
                        values (%s,%s,%s,%s,%s) returning image_uuid
                    """


        print('='*80)
        values = (str(self.image_uuid),self.image_name,self.image_display_name,self.created_by,self.created_date,)
        print('='*80)

        self.logger.debug(f'Insert : {insert_sql} values{values}')

        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(insert_sql,values)   
            image_id=cursor.fetchone()[0]
            self.jdb.dbConn.commit()
            row_count=cursor.rowcount
            self.logger.debug(f'Image Metadata Insert Success with {row_count} row(s) ')
            return response_data
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While Creating Image Metadata {error}')
                raise
        

