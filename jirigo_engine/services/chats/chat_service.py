from services.dbservice.dbconn_service import JirigoDBConn
from services.logging.logger import Logger
from nltk.chat.util import Chat, reflections
from .chat_pairs import pairs
from nltk import sent_tokenize,word_tokenize,pos_tag
from nltk.stem import WordNetLemmatizer
import string
from nltk.corpus import wordnet as wn
from collections import defaultdict
import re
import psycopg2
from psycopg2.extras import execute_values

class JirigoChatBot(object):
    def __init__(self,  data=None):
        self.jdb=JirigoDBConn()
        self.logger=Logger()
        self.query=""
        self.project_abbr=data.get('project_abbr',None)
        self.chatObj=Chat(pairs,reflections)
        self.lemmer= WordNetLemmatizer()
        self.punctuations = dict((ord(punctuation), None) for punctuation in string.punctuation)

        self.tag_map = defaultdict(lambda : wn.NOUN)
        self.tag_map['J'] = wn.ADJ
        self.tag_map['V'] = wn.VERB
        self.tag_map['R'] = wn.ADV

    def perform_lemmatization(self,tokens):
        return [self.lemmer.lemmatize(token) for token in tokens]

    def get_processed_text(self,document):
        return perform_lemmatization(nltk.word_tokenize(document.lower().translate(punctuation_removal)))

    def get_query_response(self,query):
        response_data={}
        self.query=query
        item_no=""
        chatbot_res=""

        print('*'*40)
        print(query)
        print(sent_tokenize(query))
        print(word_tokenize(query))
        print(string.punctuation)
        word_tokens = word_tokenize(query)
        lmtzr = WordNetLemmatizer()

        
        # print(self.perform_lemmatization(pos_tag(word_tokenize(query))))
        print(pos_tag(word_tokenize(query)))
        print('*'*40)
        print(self.project_abbr)
        if (re.match(r'^GET_ITEM_DETAILS',self.chatObj.respond(self.query),flags=re.IGNORECASE)):
            for token, tag in pos_tag(word_tokens):
                lemma = lmtzr.lemmatize(token, self.tag_map[tag[0]])
                print(f'{self.project_abbr}:{lemma}')
                if (re.search(self.project_abbr,lemma,re.IGNORECASE)):
                    self.item_no=lemma
                    break
            chatbot_res=self.get_item_status()
        else:
            chatbot_res=self.chatObj.respond(self.query)

        response_data['dbQryStatus']='Success'
        response_data['dbQryResponse']=chatbot_res
        print(response_data)
        return response_data
    
    def bot_converse(self):
        return self.chatObj.converse()

    def get_canned_response(self):
        return self.chatObj.respond(self.query)

    def get_item_status(self):
        response_data={}
        self.logger.debug(" Inside get_item_status")
        print("Inside get_item_status")
        print(self.item_no)
        query_sql="""  
                        SELECT item_no||' '||summary||' is in '||issue_status||' status' as item_status
                          FROM v_all_tickets_tasks vatt 
                         WHERE lower(item_no)=lower(%s)
                   """
        values=(self.item_no,)
        self.logger.debug(f'Select : {query_sql} values {values}')
        try:
            print('-'*80)
            cursor=self.jdb.dbConn.cursor()
            cursor.execute(query_sql,values)
            data=cursor.fetchone()
            if  data is None :
                print('data is none')
                data=f'Sorry, {self.item_no} doesn\'t exists'


            row_count=cursor.rowcount
            self.logger.debug(f'Select Success with {row_count} row(s) get_item_status  {data}')
            return data[0]
        except  (Exception, psycopg2.Error) as error:
            if(self.jdb.dbConn):
                print(f'Error While get_item_status {error}')
                raise