from flask import Flask
from flask import request,jsonify,make_response,Response
from flask_cors import CORS,cross_origin
import pprint
import sys
from services.dbservice.tickets.tickets_service import JirigoTicket
from services.dbservice.projects_service import JirigoProjects
from services.dbservice.users_service import JirigoUsers
from services.dbservice.refmaster_service import JirigoRefMaster
from services.dbservice.tickets.ticket_comments_service import JirigoTicketComments
from services.dbservice.tickets.ticket_audit_service import JirigoTicketAudit
from services.dbservice.tickets.ticket_dashboard import JirigoTicketDashboard
from services.dbservice.tasks.tasks_service import JirigoTask
from services.dbservice.tasks.tasks_audit_service import JirigoTaskAudit
from services.dbservice.tasks.tasks_comments_service import JirigoTaskComments
from services.dbservice.tasks.tasks_dashboard_service import JirigoTaskDashboard
from services.dbservice.sprints.sprints_service import JirigoSprints

app=Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/v1/')
def def_route(methods=['GET']):
    return "Hello In The world, Is it lonely ? let me help you, guess what : No Data Found"

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

@app.route('/api/v1/ticket-management/clone-ticket',methods=['POST'])
def clone_ticket():
    if request.method == 'POST':
        print('In Post clone_ticket')
        print(request.get_json())
        try:
            jdb=JirigoTicket.for_create_update_ticket(request.get_json())
            data=jdb.clone_ticket()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in clone_ticket {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"clone_ticket Not a POST Request")

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


@app.route('/api/v1/ticket-management/tickets/<ticket_no>',methods=['GET'])
def get_ticket_details(ticket_no):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET create_ticket')
        try:
            jdb=JirigoTicket({'ticket_no':ticket_no})
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


@app.route('/api/v1/ticket-management/audit/<ticket_no>',methods=['GET'])
def get_ticket_audit(ticket_no):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_tickets_all_comments')
        try:
            jdb=JirigoTicketAudit({'ticket_no':ticket_no})
            data=jdb.get_ticket_audit()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_audit {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_audit Not a GET Request")


@app.route('/api/v1/project-management/create-project',methods=['POST'])
def create_project():
    if request.method == 'POST':
        print('In Post create_project')
        print(request.get_json())
        try:
            jdb=JirigoProjects(request.get_json())
            data=jdb.create_project()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request")

@app.route('/api/v1/project-management/projects',methods=['GET'])
def get_all_projects():
    if request.method == 'GET':
        print('In Get get_all_projects')
        try:
            jdb=JirigoProjects({})
            data=jdb.get_all_projects()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_projects {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_projects Not a GET Request")


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

@app.route('/api/v1/ref-data-management/all-task-refs',methods=['GET'])
def get_all_task_refs():
    data={}
    if request.method == 'GET':
        print('In GET get_all_task_refs')
        try:
            jdb=JirigoRefMaster()
            data=jdb.get_all_task_refs()
            print("="*80)
            print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_task_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_task_refs Not a GET Request")


@app.route('/api/v1/ref-data-management/all-sprint-refs',methods=['GET'])
def get_all_sprint_refs():
    data={}
    if request.method == 'GET':
        print('In GET get_all_sprint_refs')
        try:
            jdb=JirigoRefMaster()
            data=jdb.get_all_sprint_refs()
            print("="*80)
            print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_sprint_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_sprint_refs Not a GET Request")



@app.route('/api/v1/dashboard-data/summaries',methods=['GET'])
def get_dashboard_summaries():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            jdb=JirigoTicketDashboard()
            data=jdb.get_ticket_summaries()
            print("="*80)
            print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_dashboard_summaries {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_dashboard_summaries Not a GET Request")

@app.route('/api/v1/task-management/task',methods=['POST'])
def create_task():
    if request.method == 'POST':
        print('In Post create_task')
        pprint.pprint(request.get_json())
        print('-'*80)
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.create_task()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_task {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request")



@app.route('/api/v1/task-management/clone-task',methods=['POST'])
def clone_task():
    if request.method == 'POST':
        print('In Post clone_task')
        print(request.get_json())
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.clone_task()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in clone_task {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"clone_task Not a POST Request")

@app.route('/api/v1/task-management/task',methods=['PUT'])
def update_task():
    if request.method == 'PUT':
        print('In Put update_task')
        print(request.get_json())
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.update_task()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_task {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a PUT Request")


@app.route('/api/v1/task-management/tasks/<task_no>',methods=['GET'])
def get_task_details(task_no):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET create_task')
        try:
            jdb=JirigoTask({'task_no':task_no})
            data=jdb.get_task_details()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


@app.route('/api/v1/task-management/tasks',methods=['GET'])
def get_all_tasks():
    data={}
    if request.method == 'GET':
        print('In GET get_all_tasks')
        try:
            jdb=JirigoTask()
            data=jdb.get_all_tasks()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


@app.route('/api/v1/task-management/comments/<task_no>',methods=['GET'])
def get_tasks_all_comments(task_no):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_tasks_all_comments')
        try:
            jdb=JirigoTaskComments({'task_no':task_no})
            data=jdb.get_tasks_all_comments()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tasks_all_comments {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tasks_all_comments Not a GET Request")


@app.route('/api/v1/task-management/comments/comment',methods=['POST'])
def create_task_comment():
    if request.method == 'POST':
        print('In Post create_task_comment')
        print(request.get_json())
        try:
            jdb=JirigoTaskComments(request.get_json())
            data=jdb.create_comment()
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_task_comment {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"create_task_comment Not a POST Request")


@app.route('/api/v1/task-management/audit/<task_no>',methods=['GET'])
def get_task_audit(task_no):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_tasks_all_comments')
        try:
            jdb=JirigoTaskAudit({'task_no':task_no})
            data=jdb.get_task_audit()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_audit {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_audit Not a GET Request")


@app.route('/api/v1/sprint-management/tasks-not-closed/<project_name>',methods=['GET'])
def get_all_not_closed_tasks_byproj_for_sprint(project_name):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_all_not_closed_tasks_byproj_for_sprint :'+project_name)
        try:
            jdb=JirigoSprints({'project_name':project_name})
            data=jdb.get_all_not_closed_tasks_byproj_for_sprint()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_not_closed_tasks_byproj_for_sprint {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_not_closed_tasks_byproj_for_sprint Not a GET Request")

@app.route('/api/v1/sprint-management/tasks-for-sprint/<sprint_id>',methods=['GET'])
def get_all_tasks_of_sprint(sprint_id):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_all_tasks_of_sprint :'+sprint_id)
        try:
            jdb=JirigoSprints({'sprint_id':sprint_id})
            data=jdb.get_all_tasks_of_sprint()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_of_sprint {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_of_sprint Not a GET Request")


@app.route('/api/v1/sprint-management/sprints-for-project/<project_name>',methods=['GET'])
def get_all_sprints_for_proj(project_name):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_all_sprints_for_proj :'+project_name)
        try:
            jdb=JirigoSprints({'project_name':project_name})
            data=jdb.get_all_sprints_for_proj()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_sprints_for_proj {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_sprints_for_proj Not a GET Request")

@app.route('/api/v1/sprint-management/tasks-for-sprint/<sprint_id>',methods=['GET'])
def get_all_tasks_for_sprint(sprint_id):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_all_tasks_for_sprint :'+sprint_id)
        try:
            jdb=JirigoSprints({'project_name':sprint_id})
            data=jdb.get_all_tasks_of_sprint()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_for_sprint {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_for_sprint Not a GET Request")


@app.route('/api/v1/sprint-management/create-sprint',methods=['POST'])
def create_sprint_with_tasks():
    if request.method == 'POST':
        print('In Post create_sprint_with_tasks')
        print(request.get_json())
        try:
            jdb=JirigoSprints(request.get_json())
            data=jdb.create_sprint_with_tasks()
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_sprint_with_tasks {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"create_sprint_with_tasks Not a POST Request")

@app.route('/api/v1/sprint-management/sprint-details',methods=['PUT'])
def update_sprint_details():
    if request.method == 'PUT':
        print('In PUT update_sprint_details')
        print(request.get_json())
        try:
            jdb=JirigoSprints(request.get_json())
            data=jdb.update_sprint_details()
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_sprint_details {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"update_sprint_details Not a PUT Request")

@app.route('/api/v1/sprint-management/sprint-tasks',methods=['PUT'])
def update_sprint_tasks():
    if request.method == 'PUT':
        print('In PUT update_sprint_tasks')
        print(request.get_json())
        try:
            jdb=JirigoSprints(request.get_json())
            data=jdb.update_sprint_tasks()
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_sprint_tasks {error}')
            return get_jsonified_error_response('Failure',error)
        return jsonify(request.get_json())
    else:
        return get_jsonified_error_response('Failure',"update_sprint_tasks Not a PUT Request")


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