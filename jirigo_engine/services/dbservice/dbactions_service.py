from flask import jsonify
import psycopg2
import datetime
import time

from .dbconn_service import JirigoDBConn
from services.logging.logger import Logger

from pprint import pprint

class JirigoDBActions(object):

    def __init__(self,data):
        print("Initializing JirigoDBActions")
        pprint(data)

        self.jdb=JirigoDBConn()
        self.logger=Logger()
        self._sql_query=''
        self._query_params=''


    @property
    def sql_query(self):
        return self._sql_query

    @sql_query.setter
    def sql_query(self,sql_query):
        self._sql_query=sql_query

    @property
    def query_params(self):
        return self._query_params

    @query_params.setter
    def sql_query(self,query_params):
        self._query_params=query_params


    def query_params(self,query_parameters):
        pass

    def insert_row(self):
        pass

    def update_row(self):
        pass

    def delete_row(self):
        pass

    def insert_rows(self):
        pass

    def update_rows(self):
        pass

    def delete_rows(self):
        pass

