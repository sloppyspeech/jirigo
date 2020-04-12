from flask import Flask
from flask import request,jsonify,make_response,Response
from flask_cors import CORS
import pprint
import sys
from services.dbservice.jirigo_tickets_dbservice import JirigoTicket
from services.dbservice.jirigo_projects_dbservice import JirigoProject
from services.dbservice.jirigo_users_dbservice import JirigoUsers
from services.dbservice.jirigo_refmaster_dbservice import JirigoRefMaster


app=Flask(__name__)
CORS(app)

@app.route('/api/v1/')
def def_route(methods=['GET']):
    return "Hello In The world is tno tht esam"

@app.route('/api/v1/ticket-management/create-ticket',methods=['POST'])
def create_ticket():
    if request.method == 'POST':
        print('In Post create_ticket')
        print(request.get_json())
        try:
            jdb=JirigoTicket.for_create_ticket(request.get_json())
            data=jdb.create_ticket()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


@app.route('/api/v1/ticket-management/tickets/<ticket_id>',methods=['GET','POST'])
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

@app.route('/api/v1/user-management/create-user',methods=['POST'])
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
        error_response['dbQryResponse']['error_code']=-1
        error_response['dbQryResponse']['error_message']=error
    return jsonify(error_response)

if __name__=='__main__':
    app.run()