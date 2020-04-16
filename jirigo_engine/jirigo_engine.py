from flask import Flask
from flask import request,jsonify,make_response,Response
from flask_cors import CORS,cross_origin
import pprint
import sys
from services.dbservice.tickets_service import JirigoTicket
from services.dbservice.projects_service import JirigoProject
from services.dbservice.users_service import JirigoUsers
from services.dbservice.refmaster_service import JirigoRefMaster
from services.dbservice.ticket_comments_service import JirigoTicketComments

app=Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/v1/')
def def_route(methods=['GET']):
    return "Hello In The world is tno tht esam"

@app.route('/api/v1/ticket-management/ticket',methods=['POST'])
def create_ticket():
    if request.method == 'POST':
        print('In Post create_ticket')
        print(request.get_json())
        try:
            jdb=JirigoTicket.for_create_update_ticket(request.get_json())
            data=jdb.create_ticket()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_ticket {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request")

@app.route('/api/v1/ticket-management/ticket',methods=['PUT'])
def update_ticket():
    if request.method == 'PUT':
        print('In Put update_ticket')
        print(request.get_json())
        try:
            jdb=JirigoTicket.for_create_update_ticket(request.get_json())
            data=jdb.update_ticket()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_ticket {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a PUT Request")


@app.route('/api/v1/ticket-management/tickets/<ticket_id>',methods=['GET'])
def get_ticket_details(ticket_id):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET create_ticket')
        try:
            jdb=JirigoTicket({'ticket_int_id':ticket_id})
            data=jdb.get_ticket_details()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


@app.route('/api/v1/ticket-management/tickets',methods=['GET'])
def get_all_tickets():
    data={}
    if request.method == 'GET':
        print('In GET get_all_tickets')
        try:
            jdb=JirigoTicket()
            data=jdb.get_all_tickets()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


@app.route('/api/v1/ticket-management/comments/<ticket_no>',methods=['GET'])
def get_tickets_all_comments(ticket_no):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_tickets_all_comments')
        try:
            jdb=JirigoTicketComments({'ticket_no':ticket_no})
            data=jdb.get_tickets_all_comments()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_all_comments {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_all_comments Not a GET Request")


@app.route('/api/v1/ticket-management/comments/comment',methods=['POST'])
def create_ticket_comment():
    if request.method == 'POST':
        print('In Post create_ticket_comment')
        print(request.get_json())
        try:
            jdb=JirigoTicketComments(request.get_json())
            data=jdb.create_comment()
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_ticket_comment {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"create_ticket_comment Not a POST Request")

@app.route('/api/v1/project-management/create-project',methods=['POST'])
def create_project():
    if request.method == 'POST':
        print('In Post create_project')
        print(request.get_json())
        try:
            jdb=JirigoProject(request.get_json())
            data=jdb.create_project()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request")

@app.route('/api/v1/user-management/user',methods=['POST'])
def create_user():
    if request.method == 'POST':
        print('In Post create_user')
        print(request.get_json())
        try:
            jdb=JirigoUsers(request.get_json())
            data=jdb.create_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request")

@app.route('/api/v1/user-management/users',methods=['GET'])
def get_all_users():
    if request.method == 'GET':
        print('In Get get_all_users')
        try:
            jdb=JirigoUsers.for_create_update_users({})
            data=jdb.get_all_users()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_users {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_users Not a GET Request")

@app.route('/api/v1/user-management/user/<user_id>',methods=['GET'])
def get_user_details(user_id):
    if request.method == 'GET':
        print('In Get get_user_details')
        try:
            jdb=JirigoUsers.for_create_update_users({'user_id':user_id})
            data=jdb.get_user_details()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_user_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_user_details Not a GET Request")

@app.route('/api/v1/user-management/user-names/<user_name_substring>',methods=['GET'])
def get_user_names(user_name_substring):
    if request.method == 'GET':
        print('In Get get_user_details')
        try:
            jdb=JirigoUsers.for_create_update_users({'user_id':None})
            data=jdb.get_user_names(user_name_substring)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_user_names {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_user_names Not a GET Request")



@app.route('/api/v1/ref-data-management/ticket-status',methods=['GET'])
def get_ticket_ref_status():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            jdb=JirigoRefMaster()
            data=jdb.get_status_values()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_ref_status {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")

@app.route('/api/v1/ref-data-management/all-ticket-refs',methods=['GET'])
def get_all_ticket_refs():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            jdb=JirigoRefMaster()
            data=jdb.get_all_ticket_refs()
            print("="*80)
            print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_ticket_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


def get_jsonified_error_response(status,error):
    error_response={}
    error_response['dbQryStatus']=status
    error_response['callingFunction']=sys._getframe(1).f_code.co_name
    error_response['dbQryResponse']={}
    try:
        error_response['dbQryResponse']['error_code']=error.pgcode
        error_response['dbQryResponse']['error_message']=error.pgerror[:60]
    except Exception as e:
        error_response['dbQryResponse']['error_code']="Not A DB Error"
        error_response['dbQryResponse']['error_message']=error
    return jsonify(error_response)

if __name__=='__main__':
    app.run()