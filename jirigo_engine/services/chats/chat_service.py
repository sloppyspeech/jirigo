from nltk.chat.util import Chat, reflections
from .chat_pairs import pairs

class JirigoChatBot(object):
    def __init__(self,):
        self.user_query=""
        self.chatObj=Chat(pairs,reflections)
    
    def get_query_response(self,query):
        print('*'*40)
        print(query)
        response_data={}
        response_data['dbQryStatus']='Success'
        response_data['dbQryResponse']=self.chatObj.respond(query)
        print(response_data)
        return response_data
    
    def bot_converse(self):
        return self.chatObj.converse()
