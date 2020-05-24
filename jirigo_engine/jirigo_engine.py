from flask import Flask
from flask import request,jsonify,make_response,Response,json,send_from_directory,send_file
from flask_cors import CORS,cross_origin
import pprint
import sys
import os
import uuid
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
from services.dbservice.boards.scrum.scrumboard_service import JirigoScrumBoard
from services.dbservice.link_tasks_tickets.link_task_ticket import JirigoLinkTaskTicket
from services.dbservice.tasks.tasks_timelogging_service import JirigoTasksLogTime
from services.dbservice.images.image_service import JirigoImages

#-------------------
UPLOAD_FOLDER='./uploaded_files'
UPLOAD_IMAGE_FOLDER='images'
UPLOAD_FILE_FOLDER='files'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
#-------------------

app=Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
print(os.path.abspath(UPLOAD_FOLDER))
app.config['UPLOAD_FOLDER']=os.path.abspath(UPLOAD_FOLDER)

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
            # print(data['dbQryResponse'])
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


@app.route('/api/v1/ticket-management/proj-all-tickets/<project_id>',methods=['GET'])
def get_all_tickets(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_tickets')
        try:
            jdb=JirigoTicket({'project_id':project_id})
            data=jdb.get_all_tickets()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")

@app.route('/api/v1/ticket-management/all-tickets-by-criterion',methods=['GET'])
def get_all_tickets_by_criterion():
    data={}
    if request.method == 'GET':
        print('In GET get_all_tickets_by_criterion')
        try:
            project_id=request.args.get('project_id')
            assignee_id=request.args.get('assignee_id')
            created_by=request.args.get('created_by')
            modified_by=request.args.get('modified_by')
            jdb=JirigoTicket({'project_id':project_id,'assignee_id':assignee_id,'created_by':created_by,'modified_by':modified_by})
            data=jdb.get_all_tickets()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tickets_by_criterion {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")


@app.route('/api/v1/ticket-management/update-assignee',methods=['POST'])
def update_ticket_assignee():
    if request.method == 'POST':
        print('In Post update_ticket_assignee')
        pprint.pprint(request.get_json())
        print('-'*80)
        try:
            jdb=JirigoTicket(request.get_json())
            data=jdb.update_ticket_assignee()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_ticket_assignee {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request")


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

@app.route('/api/v1/project-management/projects/user-projects/<user_id>',methods=['GET'])
def get_all_projects_for_user(user_id):
    if request.method == 'GET':
        print('In Get get_all_projects')
        try:
            jdb=JirigoProjects({'user_id':user_id})
            data=jdb.get_all_projects_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_projects_for_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_projects_for_user Not a GET Request")

@app.route('/api/v1/user-management/register-user',methods=['POST'])
def register_user():
    if request.method == 'POST':
        print('In Post register_user')
        print(request.get_json())
        try:
            jdb=JirigoUsers(request.get_json())
            data=jdb.register_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in register_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request in register_user")

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
            print(f'Error in create_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a POST Request in create_user")

@app.route('/api/v1/user-management/login',methods=['POST'])
def validate_userid_password():
    if request.method == 'POST':
        print('In Post validate_userid_password')
        # print(request.get_json())
        try:
            jdb=JirigoUsers(request.get_json())
            data=jdb.validate_userid_password()
            return jsonify(data)
        except Exception as error:
            print(f'Error in validate_userid_password {error}')
            return get_jsonified_error_response('Failure validate_userid_password',error)
    else:
        return get_jsonified_error_response('Failure validate_userid_password',"Not a POST Request")

@app.route('/api/v1/user-management/set-password',methods=['POST'])
def set_user_password():
    if request.method == 'POST':
        print('In Post set_user_password')
        print(request.get_json())
        try:
            jdb=JirigoUsers(request.get_json())
            data=jdb.set_user_password()
            return jsonify(data)
        except Exception as error:
            print(f'Error in set_user_password {error}')
            return get_jsonified_error_response('Failure set_user_password',error)
    else:
        return get_jsonified_error_response('Failure set_user_password',"Not a POST Request")


@app.route('/api/v1/user-management/all-users',methods=['GET'])
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

@app.route('/api/v1/user-management/user-details/<user_id>',methods=['GET'])
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

@app.route('/api/v1/user-management/authorization/auth-route-for-user',methods=['POST'])
def authenticate_route_for_user():
    data={}
    if request.method == 'POST':
        print('In POST auth_route_for_user')
        try:
            print(request.get_json())
            jdb=JirigoUsers(request.get_json())
            data=jdb.authenticate_route_for_user()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in authenticate_route_for_user {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"authenticate_route_for_user Not a POST Request")


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

@app.route('/api/v1/ref-data-management/all-ticket-refs/<project_id>',methods=['GET'])
def get_all_ticket_refs(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_ticket_refs()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_ticket_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")

@app.route('/api/v1/ref-data-management/all-task-refs/<project_id>',methods=['GET'])
def get_all_task_refs(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_task_refs')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_task_refs()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_task_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_task_refs Not a GET Request")


@app.route('/api/v1/ref-data-management/all-sprint-refs/<project_id>',methods=['GET'])
def get_all_sprint_refs(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_sprint_refs')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_sprint_refs()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_sprint_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_sprint_refs Not a GET Request")

@app.route('/api/v1/ref-data-management/all-refs-for-show-and-edit',methods=['GET'])
def get_all_refs_for_show_and_editing():
    data={}
    if request.method == 'GET':
        print('In POST get_all_refs_for_show_and_editing')
        try:
            jdb=JirigoRefMaster({})
            data=jdb.get_all_refs_for_show_and_editing()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_refs_for_show_and_editing {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_refs_for_show_and_editing Not a GET Request")

@app.route('/api/v1/ref-data-management/create-ref',methods=['POST'])
def insert_reference():
    data={}
    if request.method == 'POST':
        print('In POST insert_reference')
        try:
            jdb=JirigoRefMaster(request.get_json())
            data=jdb.insert_reference()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in insert_reference {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"insert_reference Not a POST Request")

@app.route('/api/v1/ref-data-management/edit-ref',methods=['POST'])
def update_reference():
    data={}
    if request.method == 'POST':
        print('In POST update_reference')
        try:
            jdb=JirigoRefMaster(request.get_json())
            data=jdb.update_reference()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_reference {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"update_reference Not a POST Request")


@app.route('/api/v1/ref-data-management/task-ticket-link-refs/<project_id>',methods=['GET'])
def get_all_task_ticket_link_references(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_task_ticket_link_references')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_task_ticket_link_references()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_task_ticket_link_references {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_task_ticket_link_references Not a POST Request")


@app.route('/api/v1/ticket-dashboard/summaries/generic',methods=['GET'])
def get_ticket_dashboard_generic_summary():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            print("======$$$$+++++++")
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_ticket_dashboard_generic_summary()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_dashboard_generic_summary {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_dashboard_generic_summary Not a GET Request")

@app.route('/api/v1/ticket-dashboard/summaries/issue_status',methods=['GET'])
def get_ticket_summary_by_issue_status():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            print("======$$$$+++++++")
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_ticket_summary_by_issue_status()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_summary_by_issue_status {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_summary_by_issue_status Not a GET Request")

@app.route('/api/v1/ticket-dashboard/summaries/issue_type',methods=['GET'])
def get_ticket_summary_by_issue_type():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_ref_status')
        try:
            print("======$$$$+++++++")
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_ticket_summary_by_issue_type()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_summary_by_issue_type {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_summary_by_issue_type Not a GET Request")


@app.route('/api/v1/ticket-dashboard/created-by-range',methods=['GET'])
def get_tickets_created_by_range():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_tickets_created_by_range')
        try:
            print("======$$$$+++++++")
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_tickets_created_by_range()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_created_by_range {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_created_by_range Not a GET Request")

@app.route('/api/v1/ticket-dashboard/open-last-ndays',methods=['GET'])
def get_tickets_still_open_last_n_days():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_tickets_still_open_last_n_days')
        try:
            print("======$$$$+++++++")
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_tickets_still_open_last_n_days()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_still_open_last_n_days {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_still_open_last_n_days Not a GET Request")


@app.route('/api/v1/ticket-dashboard/open-tickets-by-module-last-ndays',methods=['GET'])
def get_tickets_open_by_module_last_n_days():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_tickets_open_by_module_last_n_days')
        try:
            print("======$$$$+++++++")
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_tickets_open_by_module_last_n_days()
            print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_open_by_module_last_n_days {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_open_by_module_last_n_days Not a GET Request")



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


@app.route('/api/v1/task-management/update-assignee',methods=['POST'])
def update_task_assignee():
    if request.method == 'POST':
        print('In Post update_task_assignee')
        pprint.pprint(request.get_json())
        print('-'*80)
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.update_task_assignee()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_task_assignee {error}')
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
            # print(data['dbQryResponse'])
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


@app.route('/api/v1/task-management/all-tasks/<project_id>',methods=['GET'])
def get_all_tasks(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_tasks')
        try:
            jdb=JirigoTask({'project_id':project_id})
            data=jdb.get_all_tasks()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_details {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Not a GET Request")

@app.route('/api/v1/task-management/all-tasks-by-criterion',methods=['GET'])
def get_all_tasks_by_criterion():
    data={}
    if request.method == 'GET':
        print('In GET get_all_tasks_by_criterion')
        try:
            project_id=request.args.get('project_id')
            assignee_id=request.args.get('assignee_id')
            created_by=request.args.get('created_by')
            modified_by=request.args.get('modified_by')
            jdb=JirigoTask({'project_id':project_id,'assignee_id':assignee_id,'created_by':created_by,'modified_by':modified_by})
            data=jdb.get_all_tasks()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_by_criterion {error}')
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


@app.route('/api/v1/boards-management/scrum/<sprint_id>',methods=['GET'])
def get_all_tasks_of_sprint_for_scrum_board(sprint_id):
    error_response={}
    data={}

    if request.method == 'GET':
        print('In GET get_all_tasks_for_sprint :'+sprint_id)
        try:
            jdb=JirigoScrumBoard({'sprint_id':sprint_id})
            data=jdb.get_all_tasks_of_sprint_for_scrum_board()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_of_sprint_for_scrum_board {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_of_sprint_for_scrum_board Not a GET Request")


@app.route('/api/v1/link-tasks-tickets/search',methods=['GET'])
def get_tasks_tickets_for_multiselect_drop_down():
    data={}
    if request.method == 'GET':
        print('In GET get_tasks_tickets_for_multiselect_drop_down')
        try:
            # print("======$$$$+++++++")
            # print(request.args)
            search_term=request.args.get('search_term','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'search_term':search_term})
            data=jdb.get_tasks_tickets_for_multiselect_drop_down()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tasks_tickets_for_multiselect_drop_down {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tasks_tickets_for_multiselect_drop_down Not a GET Request")

@app.route('/api/v1/link-tasks-tickets/task-ticket/depends-on',methods=['GET'])
def get_task_or_ticket_depends_on():
    data={}
    if request.method == 'GET':
        print('In GET get_task_or_ticket_depends_on')
        try:
            # print("======$$$$+++++++")
            print(request.args)
            item_no=request.args.get('item_no','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'item_no':item_no})
            data=jdb.get_task_or_ticket_depends_on()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_or_ticket_depends_on Not a GET Request")

@app.route('/api/v1/link-tasks-tickets/task-ticket/related-to',methods=['GET'])
def get_task_or_ticket_related_to():
    data={}
    if request.method == 'GET':
        print('In GET get_task_or_ticket_related_to')
        try:
            # print("======$$$$+++++++")
            # print(request.args)
            item_no=request.args.get('item_no','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'item_no':item_no})
            data=jdb.get_task_or_ticket_related_to()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_related_to {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_or_ticket_related_to Not a GET Request")

@app.route('/api/v1/link-tasks-tickets/task-ticket/duplicated-by',methods=['GET'])
def get_task_or_ticket_duplicted_by():
    data={}
    if request.method == 'GET':
        print('In GET get_task_or_ticket_duplicted_by')
        try:
            # print("======$$$$+++++++")
            # print(request.args)
            item_no=request.args.get('item_no','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'item_no':item_no})
            data=jdb.get_task_or_ticket_duplicted_by()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_or_ticket_duplicted_by Not a GET Request")



@app.route('/api/v1/link-tasks-tickets/create-task-ticket-links',methods=['POST'])
def create_tasks_tickets_links():
    data={}
    if request.method == 'POST':
        print('In POST get_tasks_tickets_for_multiselect_drop_down')
        try:
            # print("======$$$$+++++++")
            print(request.get_json())
            jdb=JirigoLinkTaskTicket(request.get_json())
            data=jdb.create_tasks_tickets_links();
            # data=jdb.get_tasks_tickets_for_multiselect_drop_down()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tasks_tickets_for_multiselect_drop_down {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tasks_tickets_for_multiselect_drop_down Not a GET Request")

@app.route('/api/v1/timelogger/log-time',methods=['POST'])
def create_timelog_entry():
    data={}
    if request.method == 'POST':
        print('In POST create_timelog_entry')
        try:
            # print("======$$$$+++++++")
            print(request.get_json())
            jdb=JirigoTasksLogTime(request.get_json())
            data=jdb.create_timelog_entry();
            # data=jdb.get_tasks_tickets_for_multiselect_drop_down()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_timelog_entry {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"create_timelog_entry Not a GET Request")


@app.route('/api/v1/timelogger/get-task-timelog/<task_no>',methods=['GET'])
def get_timelog_entries_for_task(task_no):
    data={}
    if request.method == 'GET':
        print('In GET get_timelog_entries_for_task')
        try:
            jdb=JirigoTasksLogTime({'task_no':task_no})
            data=jdb.get_timelog_entries_for_task()
            # print("="*80)
            # print(data)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_timelog_entries_for_task Not a GET Request")


@app.route('/api/v1/image-manager/image',methods=['POST'])
def save_image():
    data={}
    print('@'*80)
    if request.method == 'POST':
        try:
            if 'file' not in request.files:
                print('No file part')
                return app.response_class(response=json.dumps({'retval':"No File Name present"}),
                                  status=500,
                                  mimetype='application/json')
            else:
                print('file is present')

            print('In POST save_image')
            print(request.form)
            print(request.files)
            file=request.files['file']
            file_name=file.filename
            created_by=request.form['created_by']
            print(file_name)
            print(created_by)
            fname,extension=file_name.split('.')
            image_uuid=uuid.uuid4()
            new_file_name=f'{image_uuid}.{extension}'
            print(new_file_name)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_file_name))
            jdb=JirigoImages({'image_name':new_file_name,'image_display_name':file_name,'image_uuid':image_uuid,'created_by':created_by})
            data=jdb.save_image_metadata_to_db()
            response = app.response_class(
                            response=json.dumps({
                                    'retval':"ImageUpload Successful",
                                    'image_url':os.path.join(app.config['UPLOAD_FOLDER'], new_file_name)
                                    }),
                            status=200,
                             mimetype='application/json'
                        )
            return response
            # return send_from_directory(app.config['UPLOAD_FOLDER'],new_file_name, as_attachment=True)
            # return response
        except Exception as error:
            print(f'Error in save_image {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        print("here in the error")
        return get_jsonified_error_response('Failure',"save_image Not a POST Request")


@app.route('/api/v1/image-management/get-image/<image_id>',methods=['GET'])
def get_image_to_display(image_id):
    print('In GET get_image_to_display '+image_id)
    data={}
    if request.method == 'GET':
        print('In GET get_image_to_display')
        try:
            # jdb=JirigoTasksLogTime({'task_no':task_no})
            # data=jdb.get_timelog_entries_for_task()
            # print("="*80)
            # print(data)
            # return jsonify(data)
            #  return send_file(os.path.join(app.config['UPLOAD_FOLDER'],'5ed8b759-fdad-4e8d-b3e7-962c5f4a7c6f.png'), mimetype='image/png')
            #  return send_from_directory(app.config['UPLOAD_FOLDER'],'5ed8b759-fdad-4e8d-b3e7-962c5f4a7c6f.png', as_attachment=True)
            print(app.config['UPLOAD_FOLDER'])
            return send_from_directory(app.config['UPLOAD_FOLDER']+'/images/avatars','1.png', as_attachment=True)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_image_to_display Not a GET Request")



def get_jsonified_error_response(status,error):
    print("=============================")
    print("get_jsonified_error_response called")
    error_response={}
    error_response['dbQryStatus']=status
    error_response['callingFunction']=sys._getframe(1).f_code.co_name
    error_response['dbQryResponse']={}
    print(error_response)
    print(error)
    print("=============================")
    fileDetails
    try:
        error_response['dbQryResponse']['error_code']=error.pgcode
        error_response['dbQryResponse']['error_message']=error.pgerror[:60]
        return jsonify(error_response)
    except Exception as e:
        print("E reached in get_jsonified_error_response")
        error_response['dbQryResponse']['error_code']="Not A DB Error"
        error_response['dbQryResponse']['error_message']=error
        print(error_response)
        print("------")
        # ret_val= app.response_class(
        #     response=json.dumps(error_response),
        #     status=200,
        #     mimetype='application/json'
        # )
        # print(ret_val)
        return make_response(jsonify(error_response),200)


if __name__=='__main__':
    app.run()