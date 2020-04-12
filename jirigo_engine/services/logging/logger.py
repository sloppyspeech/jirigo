import logging
import datetime,os 

class Logger(object):
    _logger=None

    """Logger Singleton Implementation using __new__
    
    Returns:
        [type] -- [description]
    """
    def __new__(cls):
        if cls._logger is None:
            print('Creating Logger')
            cls._logger = super(Logger, cls).__new__(cls)
            filename2=f'jirigo_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
            print(os.path.join("./logs/",filename2))
            logging.basicConfig(filename=os.path.join("./logs/",filename2), 
                            format='%(asctime)s:%(message)s', 
                            filemode='w') 

            #Creating an object 
            cls._logger=logging.getLogger() 
            
            #Setting the threshold of _logger to DEBUG 
            cls._logger.setLevel(logging.DEBUG) 
            print('*'*80)
            print(type(cls._logger))
            print('*'*80)
        return cls._logger
    
    def set_level(self,level='DEBUG'):
        levels={'DEBUG':logging.DEBUG,'INFO':logging.INFO,'ERROR':logging.ERROR,'CRITICAL':logging.CRITICAL,'WARNING':logging.WARNING}
        self._logger.setLevel(levels.get(level,logging.DEBUG))

