import psycopg2
from flask import jsonify

class JirigoDBConn(object):
    def __init__(self):
        self.dbConn=None
        print('JirigoDBConn Called For Intiation')
        try:
            self.dbConn = psycopg2.connect(user = "admin",
                                        password = "",
                                        host = "127.0.0.1",
                                        port = "5432",
                                        database = "jirigo")

            # cursor = dbConn.cursor()
            # # Print PostgreSQL Connection properties
            # print ( dbConn.get_dsn_parameters(),"\n")
            print('JirigoDBConn Initiation Successful')
        except (Exception, psycopg2.Error) as error :
            print("\n\n\n")
            print("*"*50)
            print ("********* C R I T I C A L    E R R O R  *********")
            print("          While connecting to PostgreSQL")
            print(error)
            print("*"*50)
            print("\n\n\n")
        
    def close_conn(self):
        #closing database connection.
            if(self.dbConn):
                self.dbConn.close()
                print("PostgreSQL connection is closed")
    
        

    

