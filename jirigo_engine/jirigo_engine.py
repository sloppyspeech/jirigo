from flask import Flask
from flask import request,jsonify,make_response,Response,json,send_from_directory,send_file
from flask_cors import CORS,cross_origin
import pprint
import sys
import os
import uuid
from services.dbservice.dbconn_service import JirigoDBConn
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
from services.dbservice.workflows.project_workflow_service import JirigoProjectWorkflow
from services.dbservice.roles.role_service import JirigoRoles
from services.dbservice.tickets.ticket_timelogging_service  import JirigoTicketLogTime
from services.dbservice.menus.menus_service import JirigoMenus
from services.dbservice.data_extracts.data_extract_service import JirigoDataExtract
from services.dbservice.homepage.homepage_service import JirigoHomePage
from services.dbservice.vacations.vacation_service import JirigoVacations
from services.dbservice.todos.todos_service import JirigoTodos
from services.dbservice.boards.scrum.sprint_dashboard_service import JirigoSprintDashboard
from services.dbservice.global_search.global_search_service import JirigoGlobalSearch

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
        return get_jsonified_error_response('Failure',get_errmsg('NAPR'))

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
        return get_jsonified_error_response('Failure',"clone_ticket "+get_errmsg('NAPR'))

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
        return get_jsonified_error_response('Failure',get_errmsg('NAPUR'))


@app.route('/api/v1/ticket-management/tickets/<ticket_no>',methods=['GET'])
def get_ticket_details(ticket_no):
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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))

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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',get_errmsg('NAPR'))


@app.route('/api/v1/ticket-management/comments/<ticket_no>',methods=['GET'])
def get_tickets_all_comments(ticket_no):
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
        return get_jsonified_error_response('Failure',"get_tickets_all_comments " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',"create_ticket_comment " + get_errmsg('NAPR'))


@app.route('/api/v1/ticket-management/audit/<ticket_no>',methods=['GET'])
def get_ticket_audit(ticket_no):
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
        return get_jsonified_error_response('Failure',"get_ticket_audit " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',get_errmsg('NAPR'))


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
        return get_jsonified_error_response('Failure',"get_all_projects " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',"get_all_projects_for_user " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',"register_user "+get_errmsg('NAPR'))


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
        return get_jsonified_error_response('Failure',"create_user "+get_errmsg('NAPR'))


@app.route('/api/v1/user-management/user-activate-inactivate',methods=['PUT'])
def update_toggle_active_status():
    if request.method == 'PUT':
        print('In PUT update_toggle_active_status')
        print(request.get_json())
        try:
            jdb=JirigoUsers(request.get_json())
            data=jdb.update_toggle_active_status()
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_toggle_active_status {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"update_toggle_active_status "+get_errmsg('NAPUR'))


@app.route('/api/v1/user-management/login',methods=['POST'])
def validate_userid_password():
    if request.method == 'POST':
        print('In Post validate_userid_password')
        try:
            print(request.get_json())
            jdb=JirigoUsers(request.get_json())
            data=jdb.validate_userid_password()
            return jsonify(data)
        except Exception as error:
            print(f'Error in validate_userid_password {error}')
            return get_jsonified_error_response('Failure validate_userid_password',error)
    else:
        return get_jsonified_error_response('Failure ',"validate_userid_password "+get_errmsg('NAPR'))

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
        return get_jsonified_error_response('Failure', "set_user_password " + get_errmsg('NAPR'))


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
        return get_jsonified_error_response('Failure',"get_all_users " + get_errmsg('NAGR'))

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
        return get_jsonified_error_response('Failure',"get_user_details " + get_errmsg('NAGR'))

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
        return get_jsonified_error_response('Failure',"get_user_names " + get_errmsg('NAGR'))

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
            return jsonify(data)
        except Exception as error:
            print(f'Error in authenticate_route_for_user {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"authenticate_route_for_user " +get_errmsg('NAPR'))


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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))

@app.route('/api/v1/ref-data-management/all-ticket-refs/<project_id>',methods=['GET'])
def get_all_ticket_refs(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_ticket_refs')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_ticket_refs()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_ticket_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))

@app.route('/api/v1/ref-data-management/all-task-refs/<project_id>',methods=['GET'])
def get_all_task_refs(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_task_refs')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_task_refs()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_task_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_task_refs " + get_errmsg('NAGR'))


@app.route('/api/v1/ref-data-management/all-sprint-refs/<project_id>',methods=['GET'])
def get_all_sprint_refs(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_sprint_refs')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_sprint_refs()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_sprint_refs {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_sprint_refs " + get_errmsg('NAGR'))

@app.route('/api/v1/ref-data-management/all-refs-for-show-and-edit',methods=['GET'])
def get_all_refs_for_show_and_editing():
    data={}
    if request.method == 'GET':
        print('In POST get_all_refs_for_show_and_editing')
        try:
            jdb=JirigoRefMaster({})
            data=jdb.get_all_refs_for_show_and_editing()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_refs_for_show_and_editing {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_refs_for_show_and_editing " + get_errmsg('NAGR'))

@app.route('/api/v1/ref-data-management/create-ref',methods=['POST'])
def insert_reference():
    data={}
    if request.method == 'POST':
        print('In POST insert_reference')
        try:
            jdb=JirigoRefMaster(request.get_json())
            data=jdb.insert_reference()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in insert_reference {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"insert_reference " + get_errmsg('NAPR'))

@app.route('/api/v1/ref-data-management/edit-ref',methods=['POST'])
def update_reference():
    data={}
    if request.method == 'POST':
        print('In POST update_reference')
        try:
            jdb=JirigoRefMaster(request.get_json())
            data=jdb.update_reference()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_reference {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"update_reference " + get_errmsg('NAPR'))


@app.route('/api/v1/ref-data-management/task-ticket-link-refs/<project_id>',methods=['GET'])
def get_all_task_ticket_link_references(project_id):
    data={}
    if request.method == 'GET':
        print('In GET get_all_task_ticket_link_references')
        try:
            jdb=JirigoRefMaster({'project_id':project_id})
            data=jdb.get_all_task_ticket_link_references()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_task_ticket_link_references {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_task_ticket_link_references" + get_errmsg('NAPR'))


@app.route('/api/v1/ticket-dashboard/summaries/generic',methods=['GET'])
def get_ticket_dashboard_generic_summary():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_dashboard_generic_summary')
        try:
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_ticket_dashboard_generic_summary()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_dashboard_generic_summary {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_dashboard_generic_summary "+get_errmsg('NAGR'))

@app.route('/api/v1/ticket-dashboard/summaries/issue_status',methods=['GET'])
def get_ticket_summary_by_issue_status():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_summary_by_issue_status')
        try:
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_ticket_summary_by_issue_status()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_summary_by_issue_status {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_summary_by_issue_status " + get_errmsg('NAGR'))

@app.route('/api/v1/ticket-dashboard/summaries/issue_type',methods=['GET'])
def get_ticket_summary_by_issue_type():
    data={}
    if request.method == 'GET':
        print('In GET get_ticket_summary_by_issue_type')
        try:
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_ticket_summary_by_issue_type()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_ticket_summary_by_issue_type {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_ticket_summary_by_issue_type " + get_errmsg('NAGR'))


@app.route('/api/v1/ticket-dashboard/created-by-range',methods=['GET'])
def get_tickets_created_by_range():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_tickets_created_by_range')
        try:

            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_tickets_created_by_range()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_created_by_range {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_created_by_range " + get_errmsg('NAGR'))

@app.route('/api/v1/ticket-dashboard/open-last-ndays',methods=['GET'])
def get_tickets_still_open_last_n_days():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_tickets_still_open_last_n_days')
        try:
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_tickets_still_open_last_n_days()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_still_open_last_n_days {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_still_open_last_n_days  "+ get_errmsg('NAGR'))


@app.route('/api/v1/ticket-dashboard/open-tickets-by-module-last-ndays',methods=['GET'])
def get_tickets_open_by_module_last_n_days():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_tickets_open_by_module_last_n_days')
        try:
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_tickets_open_by_module_last_n_days()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tickets_open_by_module_last_n_days {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tickets_open_by_module_last_n_days "+ get_errmsg('NAGR'))

@app.route('/api/v1/ticket-dashboard/count-of-tickets-by-channel-last-ndays',methods=['GET'])
def get_count_of_tickets_by_channel_last_n_days():
    data={}
    last_n_days=0
    project_id=0
    if request.method == 'GET':
        print('In GET get_count_of_tickets_by_channel_last_n_days')
        try:
            print(request.args)
            last_n_days=request.args.get('last_n_days',0)
            project_id=request.args.get('project_id',0)
            jdb=JirigoTicketDashboard({'last_n_days':last_n_days,'project_id':project_id})
            data=jdb.get_count_of_tickets_by_channel_last_n_days()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_count_of_tickets_by_channel_last_n_days {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_count_of_tickets_by_channel_last_n_days "+ get_errmsg('NAGR'))




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
        return get_jsonified_error_response('Failure',get_errmsg('NAPR'))


@app.route('/api/v1/task-management/update-assignee',methods=['PUT'])
def update_task_assignee():
    if request.method == 'PUT':
        print('In PUT update_task_assignee')
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
        return get_jsonified_error_response('Failure',get_errmsg('NAPR'))

@app.route('/api/v1/task-management/update-taskstatus',methods=['PUT'])
def update_task_status():
    if request.method == 'PUT':
        print('In PUT update_task_status')
        pprint.pprint(request.get_json())
        print('-'*80)
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.update_task_status()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_task_status {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',get_errmsg('NAPR'))



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
        return get_jsonified_error_response('Failure',"clone_task " + get_errmsg('NAPR'))

@app.route('/api/v1/task-management/task',methods=['PUT'])
def update_task():
    if request.method == 'PUT':
        print('In Put update_task')
        print(request.get_json())
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.update_task()
            print('*'*40)
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_task {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',get_errmsg('NAPUR'))


@app.route('/api/v1/task-management/tasks/<task_no>',methods=['GET'])
def get_task_details(task_no):
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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))

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
        return get_jsonified_error_response('Failure',get_errmsg('NAGR'))


@app.route('/api/v1/task-management/comments/<task_no>',methods=['GET'])
def get_tasks_all_comments(task_no):
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
        return get_jsonified_error_response('Failure',"get_tasks_all_comments " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',"create_task_comment " + get_errmsg('NAPR'))


@app.route('/api/v1/task-management/audit/<task_no>',methods=['GET'])
def get_task_audit(task_no):
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
        return get_jsonified_error_response('Failure',"get_task_audit " + get_errmsg('NAGR'))

@app.route('/api/v1/task-management/task-estimates',methods=['POST'])
def create_update_task_estimates():
    if request.method == 'POST':
        print('In Post create_update_task_estimates')
        print(request.get_json())
        try:
            jdb=JirigoTask(request.get_json())
            data=jdb.create_update_task_estimates()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_update_task_estimates {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"create_update_task_estimates " + get_errmsg('NAPR'))


@app.route('/api/v1/task-management/task-estimates',methods=['GET'])
def get_task_estimates():
    if request.method == 'GET':
        print('In Get global_search')
        try:
            task_no=request.args.get('task_no')
            print(task_no)
            jdb=JirigoTask({'task_no':task_no})
            data=jdb.get_task_estimates()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_estimates {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_estimates " + get_errmsg('NAGR'))



@app.route('/api/v1/sprint-management/tasks-not-closed/<project_name>',methods=['GET'])
def get_all_not_closed_tasks_byproj_for_sprint(project_name):
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
        return get_jsonified_error_response('Failure',"get_all_not_closed_tasks_byproj_for_sprint " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-management/tasks-for-sprint/<sprint_id>',methods=['GET'])
def get_all_tasks_of_sprint(sprint_id):
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
        return get_jsonified_error_response('Failure',"get_all_tasks_of_sprint " + get_errmsg('NAGR'))


@app.route('/api/v1/sprint-management/sprints-for-project/<project_name>',methods=['GET'])
def get_all_sprints_for_proj(project_name):
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
        return get_jsonified_error_response('Failure',"get_all_sprints_for_proj " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-management/tasks-for-sprint/<sprint_id>',methods=['GET'])
def get_all_tasks_for_sprint(sprint_id):
    data={}

    if request.method == 'GET':
        print('In GET get_all_tasks_for_sprint :'+sprint_id)
        try:
            jdb=JirigoSprints({'sprint_id':sprint_id})
            data=jdb.get_all_tasks_of_sprint()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_for_sprint {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_for_sprint " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-management/sprint-gantt-data',methods=['GET'])
def get_data_for_sprint_gantt():
    data={}
    if request.method == 'GET':
        try:
            sprint_id=request.args.get('sprint_id')
            jdb=JirigoSprints({'sprint_id':sprint_id})
            data=jdb.get_data_for_sprint_gantt()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_data_for_sprint_gantt {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_data_for_sprint_gantt " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',"create_sprint_with_tasks " + get_errmsg('NAGR'))

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
        return get_jsonified_error_response('Failure',"update_sprint_details " + get_errmsg('NAGR'))

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
        return get_jsonified_error_response('Failure',"update_sprint_tasks " + get_errmsg('NAGR'))


@app.route('/api/v1/boards-management/scrum',methods=['GET'])
def get_all_tasks_of_sprint_for_scrum_board():
    data={}

    if request.method == 'GET':
        try:
            sprint_id=request.args.get('sprint_id')
            jdb=JirigoScrumBoard({'sprint_id':sprint_id})
            data=jdb.get_all_tasks_of_sprint_for_scrum_board()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_of_sprint_for_scrum_board {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_of_sprint_for_scrum_board " + get_errmsg('NAGR'))


@app.route('/api/v1/boards-management/update-sprint-steps-for-scrumboard',methods=['PUT'])
def update_sprint_task_steps_for_scrumboard():
    data={}

    if request.method == 'PUT':
        try:
            print(request.get_json())
            sprint_id=request.get_json()['sprint_id']
            sprint_tasks=request.get_json()['sprint_tasks']
            modified_by=request.get_json()['modified_by']
            jdb=JirigoScrumBoard({'sprint_id':sprint_id,'sprint_tasks':sprint_tasks,'modified_by':modified_by})
            data=jdb.update_sprint_task_steps_for_scrumboard()
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_sprint_task_steps_for_scrumboard {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"update_sprint_task_steps_for_scrumboard " + get_errmsg('NAPUR'))



@app.route('/api/v1/link-tasks-tickets/search',methods=['GET'])
def get_tasks_tickets_for_multiselect_drop_down():
    data={}
    if request.method == 'GET':
        print('In GET get_tasks_tickets_for_multiselect_drop_down')
        try:
            search_term=request.args.get('search_term','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'search_term':search_term})
            data=jdb.get_tasks_tickets_for_multiselect_drop_down()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tasks_tickets_for_multiselect_drop_down {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tasks_tickets_for_multiselect_drop_down " + get_errmsg('NAGR'))

@app.route('/api/v1/link-tasks-tickets/task-ticket/depends-on',methods=['GET'])
def get_task_or_ticket_depends_on():
    data={}
    if request.method == 'GET':
        print('In GET get_task_or_ticket_depends_on')
        try:
            print(request.args)
            item_no=request.args.get('item_no','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'item_no':item_no})
            data=jdb.get_task_or_ticket_depends_on()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_or_ticket_depends_on " + get_errmsg('NAGR'))

@app.route('/api/v1/link-tasks-tickets/task-ticket/related-to',methods=['GET'])
def get_task_or_ticket_related_to():
    data={}
    if request.method == 'GET':
        print('In GET get_task_or_ticket_related_to')
        try:
            item_no=request.args.get('item_no','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'item_no':item_no})
            data=jdb.get_task_or_ticket_related_to()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_related_to {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_or_ticket_related_to " + get_errmsg('NAGR'))

@app.route('/api/v1/link-tasks-tickets/task-ticket/duplicated-by',methods=['GET'])
def get_task_or_ticket_duplicted_by():
    data={}
    if request.method == 'GET':
        print('In GET get_task_or_ticket_duplicted_by')
        try:
            item_no=request.args.get('item_no','')
            project_id=request.args.get('project_id',0)
            jdb=JirigoLinkTaskTicket({'project_id':project_id,'item_no':item_no})
            data=jdb.get_task_or_ticket_duplicted_by()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_or_ticket_duplicted_by " + get_errmsg('NAGR'))



@app.route('/api/v1/link-tasks-tickets/create-task-ticket-links',methods=['POST'])
def create_tasks_tickets_links():
    data={}
    if request.method == 'POST':
        print('In POST get_tasks_tickets_for_multiselect_drop_down')
        try:
            print(request.get_json())
            jdb=JirigoLinkTaskTicket(request.get_json())
            data=jdb.create_tasks_tickets_links();
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_tasks_tickets_for_multiselect_drop_down {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_tasks_tickets_for_multiselect_drop_down " + get_errmsg('NAGR'))

@app.route('/api/v1/timelogger/tasks/task/log-time',methods=['POST'])
def create_timelog_entry():
    data={}
    if request.method == 'POST':
        print('In POST create_timelog_entry')
        try:
            print(request.get_json())
            jdb=JirigoTasksLogTime(request.get_json())
            data=jdb.create_timelog_entry();
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_timelog_entry {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"create_timelog_entry " + get_errmsg('NAGR'))


@app.route('/api/v1/timelogger/tasks/task/timelog/<task_no>',methods=['GET'])
def get_timelog_entries_for_task(task_no):
    data={}
    if request.method == 'GET':
        print('In GET get_timelog_entries_for_task')
        try:
            jdb=JirigoTasksLogTime({'task_no':task_no})
            data=jdb.get_timelog_entries_for_task()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_timelog_entries_for_task " + get_errmsg('NAGR'))

@app.route('/api/v1/timelogger/tickets/ticket/log-time',methods=['POST'])
def create_ticket_timelog_entry():
    data={}
    if request.method == 'POST':
        print('In POST create_ticket_timelog_entry')
        try:
            print(request.get_json())
            jdb=JirigoTicketLogTime(request.get_json())
            data=jdb.create_timelog_entry();
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_ticket_timelog_entry {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"Ticket create_ticket_timelog_entry " + get_errmsg('NAGR'))


@app.route('/api/v1/timelogger/tickets/timelog/<ticket_no>',methods=['GET'])
def get_timelog_entries_for_ticket(ticket_no):
    data={}
    if request.method == 'GET':
        print('In GET get_timelog_entries_for_ticket')
        try:
            jdb=JirigoTicketLogTime({'ticket_no':ticket_no})
            data=jdb.get_timelog_entries_for_ticket()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_timelog_entries_for_ticket " + get_errmsg('NAGR'))


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
        return get_jsonified_error_response('Failure',"save_image " + get_errmsg('NAPR'))


@app.route('/api/v1/image-management/get-image/<image_id>',methods=['GET'])
def get_image_to_display(image_id):
    print('In GET get_image_to_display '+image_id)
    data={}
    if request.method == 'GET':
        print('In GET get_image_to_display')
        try:
            print(app.config['UPLOAD_FOLDER'])
            return send_from_directory(app.config['UPLOAD_FOLDER']+'/images/avatars','1.png', as_attachment=True)
        except Exception as error:
            print(f'Error in get_task_or_ticket_depends_on {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_image_to_display " + get_errmsg('NAGR'))

@app.route('/api/v1/workflows-management/create-project-workflow',methods=['POST'])
def create_project_workflow():
    data=''
    if request.method == 'POST':
        print('In Post create_project_workflow')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoProjectWorkflow(request.get_json())
            data=jdb.create_project_workflow()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_project_workflow {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"create_project_workflow " + get_errmsg('NAPR'))

@app.route('/api/v1/workflows-management/update-project-workflow',methods=['PUT'])
def update_project_workflow():
    data=''
    if request.method == 'PUT':
        print('In Post update_project_workflow')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoProjectWorkflow(request.get_json())
            data=jdb.update_project_workflow()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_project_workflow {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"update_project_workflow " + get_errmsg('NAPUR'))

@app.route('/api/v1/workflows-management/next-steps-allowed',methods=['GET'])
def get_next_allowed_workflow_statuses():
    data=''
    if request.method == 'GET':
        print('In GET get_next_allowed_workflow_statuses')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            current_status=request.args.get('current_status')
            jdb=JirigoProjectWorkflow({'project_id':project_id,'role_id':role_id,'current_status':current_status})
            data=jdb.get_next_allowed_workflow_statuses()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_next_allowed_workflow_statuses {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_next_allowed_workflow_statuses " + get_errmsg('NAGR'))

@app.route('/api/v1/workflows-management/all-statuses',methods=['GET'])
def get_all_statuses_for_workflow():
    data=''
    if request.method == 'GET':
        print('In GET get_all_statuses_for_workflow')
        try:
            project_id=request.args.get('project_id')
            ref_category=request.args.get('ref_category')
            jdb=JirigoProjectWorkflow({'project_id':project_id,'ref_category':ref_category})
            data=jdb.get_all_statuses_for_workflow()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_statuses_for_workflow {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_statuses_for_workflow " + get_errmsg('NAGR'))

@app.route('/api/v1/workflows-management/not-allocated-to-role',methods=['GET'])
def get_workflows_not_assigned_to_project_role():
    data=''
    if request.method == 'GET':
        print('In GET get_workflows_not_assigned_to_project_role')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            jdb=JirigoProjectWorkflow({'project_id':project_id,'role_id':role_id})
            data=jdb.get_workflows_not_assigned_to_project_role()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_workflows_not_assigned_to_project_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_workflows_not_assigned_to_project_role " + get_errmsg('NAGR'))

@app.route('/api/v1/workflows-management/projects-roles-workflows',methods=['GET'])
def get_project_role_workflow_list_for_update():
    data=''
    if request.method == 'GET':
        print('In GET get_project_role_workflow_list_for_update')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            jdb=JirigoProjectWorkflow({'project_id':project_id,'role_id':role_id})
            data=jdb.get_project_role_workflow_list_for_update()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_project_role_workflow_list_for_update {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_project_role_workflow_list_for_update " + get_errmsg('NAGR'))

@app.route('/api/v1/workflows-management/workflow-details-for-update',methods=['GET'])
def get_workflow_details_for_update():
    data=''
    if request.method == 'GET':
        print('In GET get_workflow_details_for_update')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            workflow_id=request.args.get('workflow_id')
            jdb=JirigoProjectWorkflow({'project_id':project_id,'role_id':role_id,'workflow_id':workflow_id})
            data=jdb.get_workflow_details_for_update()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_workflow_details_for_update {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_workflow_details_for_update " + get_errmsg('NAGR'))



@app.route('/api/v1/role-management/all-active',methods=['GET'])
def get_all_active_roles():
    data={}
    if request.method == 'GET':
        print('In GET get_all_active_roles')
        try:
            jdb=JirigoRoles()
            data=jdb.get_all_active_roles()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_active_roles {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_active_roles " + get_errmsg('NAGR'))


@app.route('/api/v1/role-management/roles-active-for-all-projects',methods=['GET'])
def get_roles_active_for_allprojects():
    data={}
    if request.method == 'GET':
        print('In GET get_active_project_roles')
        try:
            jdb=JirigoRoles()
            data=jdb.get_roles_active_for_allprojects()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_roles_active_for_allprojects {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_roles_active_for_allprojects" + get_errmsg('NAGR'))



@app.route('/api/v1/role-management/roles-assignable-for-user-by-project',methods=['GET'])
def get_roles_for_user_assignment():
    data={}
    if request.method == 'GET':
        print('In GET get_active_project_roles')
        try:
            project_id=request.args.get('project_id')
            user_id=request.args.get('user_id')
            jdb=JirigoRoles({'user_id':user_id,'project_id':project_id})
            data=jdb.get_roles_for_user_assignment()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_roles_for_user_assignment {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_roles_for_user_assignment" + get_errmsg('NAGR'))

@app.route('/api/v1/role-management/project-role',methods=['POST'])
def add_project_role():
    data=''
    if request.method == 'POST':
        print('In Post add_project_role')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoRoles(request.get_json())
            data=jdb.add_project_role()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in add_project_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"add_project_role " + get_errmsg('NAPR'))

@app.route('/api/v1/role-management/assign-roles-to-user',methods=['POST'])
def assign_roles_to_user():
    data=''
    if request.method == 'POST':
        print('In Post assign_roles_to_user')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoRoles(request.get_json())
            data=jdb.assign_roles_to_user()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in assign_roles_to_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"assign_roles_to_user " + get_errmsg('NAPR'))


@app.route('/api/v1/role-management/assign-workflow-to-role',methods=['POST'])
def assign_workflow_to_role():
    data=''
    if request.method == 'POST':
        print('In Post assign_workflow_to_role')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoRoles(request.get_json())
            data=jdb.assign_workflow_to_role()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in assign_workflow_to_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"assign_workflow_to_role " + get_errmsg('NAPR'))



@app.route('/api/v1/role-management/update-role',methods=['PUT'])
def update_role():
    data=''
    if request.method == 'PUT':
        print('In PUT update_role')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoRoles(request.get_json())
            data=jdb.update_role()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in update_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"update_role " + get_errmsg('NAPR'))

@app.route('/api/v1/role-management/add-role',methods=['POST'])
def add_role():
    data=''
    if request.method == 'POST':
        print('In Post add_role')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoRoles(request.get_json())
            data=jdb.add_role()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in add_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"add_role " + get_errmsg('NAPR'))


@app.route('/api/v1/role-management/project-role',methods=['DELETE'])
def remove_project_role():
    data=''
    if request.method == 'DELETE':
        print('In Post remove_project_role')
        pprint.pprint(request.get_json())
        try:
            jdb=JirigoRoles(request.get_json())
            data=jdb.remove_project_role()
            print('*'*40)
            print(data['dbQryResponse'])
            return jsonify(data)
        except Exception as error:
            print(f'Error in remove_project_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"remove_project_role " + get_errmsg('NADR'))

@app.route('/api/v1/menu-management/all-menuitems-by-role-project',methods=['GET'])
def get_all_menus_details_for_projectrole():
    if request.method == 'GET':
        print('In Get get_all_menus_details_for_projectrole')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            jdb=JirigoMenus({'role_id':role_id,'project_id':project_id})
            data=jdb.get_all_menus_details_for_projectrole()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_menus_details_for_projectrole {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_menus_details_for_projectrole " + get_errmsg('NAGR'))

@app.route('/api/v1/menu-management/all-menus-for-project',methods=['GET'])
def get_all_menus_for_project():
    data={}
    if request.method == 'GET':
        print('In GET get_active_project_roles')
        try:
            jdb=JirigoMenus()
            data=jdb.get_all_menus_for_project()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_menus_for_project {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_menus_for_project" + get_errmsg('NAGR'))

@app.route('/api/v1/menu-management/valid-routes-for-user',methods=['GET'])
def get_all_valid_routes_for_user():
    data={}
    if request.method == 'GET':
        print('In GET get_all_valid_routes_for_user')
        try:
            project_id=request.args.get('project_id','')
            user_id=request.args.get('user_id','')
            role_id=request.args.get('role_id','')

            jdb=JirigoUsers({'project_id':project_id,'user_id':user_id,'role_id':role_id})
            data=jdb.get_all_valid_routes_for_user()
            print("="*80)
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_valid_routes_for_user {error}')
            print(get_jsonified_error_response('Failure',error))
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_valid_routes_for_user " +get_errmsg('NAGR'))


@app.route('/api/v1/menu-management/all-unassigned-menuitems-by-role-project',methods=['GET'])
def get_all_unassigned_menus_for_projectrole():
    if request.method == 'GET':
        print('In Get get_all_unassigned_menus_for_projectrole')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            jdb=JirigoMenus({'role_id':role_id,'project_id':project_id})
            data=jdb.get_all_unassigned_menus_for_projectrole()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_unassigned_menus_for_projectrole {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_unassigned_menus_for_projectrole " + get_errmsg('NAGR'))


@app.route('/api/v1/menu-management/all-assigned-menuitems-by-role-project',methods=['GET'])
def get_all_assigned_menus_for_projectrole():
    if request.method == 'GET':
        print('In Get get_all_assigned_menus_for_projectrole')
        try:
            project_id=request.args.get('project_id')
            role_id=request.args.get('role_id')
            jdb=JirigoMenus({'role_id':role_id,'project_id':project_id})
            data=jdb.get_all_assigned_menus_for_projectrole()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_assigned_menus_for_projectrole {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_assigned_menus_for_projectrole " + get_errmsg('NAGR'))


@app.route('/api/v1/menu-management/add-menus-to-role',methods=['POST'])
def add_menus_to_role():
    if request.method == 'POST':
        print('In Get add_menus_to_role')
        print(request.get_json())
        try:
            jdb=JirigoMenus(request.get_json())
            data=jdb.add_menus_to_role()
            return jsonify(data)
        except Exception as error:
            print(f'Error in add_menus_to_role {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"add_menus_to_role " + get_errmsg('NAPR'))

@app.route('/api/v1/menu-management/add-menu',methods=['POST'])
def add_menu():
    if request.method == 'POST':
        print('In Get add_menu')
        print(request.get_json())
        try:
            jdb=JirigoMenus(request.get_json())
            data=jdb.add_menu()
            return jsonify(data)
        except Exception as error:
            print(f'Error in add_menu {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"add_menu " + get_errmsg('NAPR'))


@app.route('/api/v1/data-extracts/tickets-by-daterange',methods=['GET'])
def get_all_tickets_for_time_range():
    if request.method == 'GET':
        print('In Get get_all_tickets_for_time_range')
        try:
            start_date=request.args.get('start_date')
            end_date=request.args.get('end_date')
            jdb=JirigoDataExtract({'start_date':start_date,'end_date':end_date})
            data=jdb.get_all_tickets_for_time_range()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tickets_for_time_range {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tickets_for_time_range " + get_errmsg('NAGR'))

@app.route('/api/v1/data-extracts/tasks-by-daterange',methods=['GET'])
def get_all_tasks_for_time_range():
    if request.method == 'GET':
        print('In Get get_all_tasks_for_time_range')
        try:
            start_date=request.args.get('start_date')
            end_date=request.args.get('end_date')
            jdb=JirigoDataExtract({'start_date':start_date,'end_date':end_date})
            data=jdb.get_all_tasks_for_time_range()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_for_time_range {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_for_time_range " + get_errmsg('NAGR'))

@app.route('/api/v1/homepage/recent-proj-activities',methods=['GET'])
def get_recent_proj_ticket_task_activities():
    if request.method == 'GET':
        print('In Get get_recent_proj_ticket_task_activities')
        try:
            project_id=request.args.get('project_id')
            current_user_id=request.args.get('current_user_id')
            num_rows=request.args.get('num_rows')
            jdb=JirigoHomePage({'project_id':project_id,'current_user_id':current_user_id,'num_rows':num_rows})
            data=jdb.get_recent_proj_ticket_task_activities()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_recent_proj_ticket_task_activities {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_recent_proj_ticket_task_activities " + get_errmsg('NAGR'))


@app.route('/api/v1/vacation-management/create-vacation',methods=['POST'])
def cre_vacation_for_user_by_timerange():
    if request.method == 'POST':
        print('In Post cre_vacation_for_user_by_timerange')
        print(request.get_json())
        try:
            jdb=JirigoVacations(request.get_json())
            data=jdb.cre_vacation_for_user_by_timerange()
            return jsonify(data)
        except Exception as error:
            print(f'Error in cre_vacation_for_user_by_timerange {error}')
            return get_jsonified_error_response('Failure cre_vacation_for_user_by_timerange',error)
    else:
        return get_jsonified_error_response('Failure', "cre_vacation_for_user_by_timerange " + get_errmsg('NAPR'))

@app.route('/api/v1/vacation-management/update-vacation-for-user',methods=['PUT'])
def upd_vacation_for_user():
    if request.method == 'PUT':
        print('In Post upd_vacation_for_user')
        print(request.get_json())
        try:
            jdb=JirigoVacations(request.get_json())
            data=jdb.upd_vacation_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in upd_vacation_for_user {error}')
            return get_jsonified_error_response('Failure upd_vacation_for_user',error)
    else:
        return get_jsonified_error_response('Failure', "upd_vacation_for_user " + get_errmsg('NAPUR'))


@app.route('/api/v1/vacation-management/all-vacations-by-timerange',methods=['GET'])
def get_all_vacations_by_timerange():
    if request.method == 'GET':
        print('In Get get_all_vacations_by_timerange')
        try:
            start_date=request.args.get('start_date')
            end_date=request.args.get('end_date')
            jdb=JirigoVacations({'start_date':start_date,'end_date':end_date})
            data=jdb.get_all_vacations_by_timerange()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_vacations_by_timerange {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_vacations_by_timerange " + get_errmsg('NAGR'))

@app.route('/api/v1/vacation-management/check-overlap',methods=['GET'])
def check_vacation_overlap():
    if request.method == 'GET':
        print('In Get check_vacation_overlap')
        try:
            user_id=request.args.get('user_id')
            input_date=request.args.get('input_date')
            jdb=JirigoVacations({'user_id':user_id,'input_date':input_date})
            data=jdb.check_vacation_overlap()
            return jsonify(data)
        except Exception as error:
            print(f'Error in check_vacation_overlap {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"check_vacation_overlap " + get_errmsg('NAGR'))

@app.route('/api/v1/vacation-management/all-user-vacations',methods=['GET'])
def get_all_vacations_for_user():
    if request.method == 'GET':
        print('In Get get_all_vacations_for_user')
        try:
            user_id=request.args.get('user_id')
            jdb=JirigoVacations({'user_id':user_id})
            data=jdb.get_all_vacations_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_vacations_for_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_vacations_for_user " + get_errmsg('NAGR'))

@app.route('/api/v1/vacation-management/vacation-in-timerange',methods=['GET'])
def get_vacation_for_user_by_timerange():
    if request.method == 'GET':
        print('In Get get_vacation_for_user_by_timerange')
        try:
            user_id=request.args.get('user_id')
            input_date=request.args.get('input_date')
            print(input_date)
            jdb=JirigoVacations({'user_id':user_id,'input_date':input_date})
            data=jdb.get_vacation_for_user_by_timerange()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_vacation_for_user_by_timerange {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_vacation_for_user_by_timerange " + get_errmsg('NAGR'))


@app.route('/api/v1/todos-management/all-todos',methods=['GET'])
def get_all_todos_for_user():
    if request.method == 'GET':
        print('In Get get_all_user_todos')
        try:
            user_id=request.args.get('user_id')
            limit=request.args.get('limit')
            offset=request.args.get('offset')
            jdb=JirigoTodos({'user_id':user_id})
            data=jdb.get_all_todos_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_user_todos {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_user_todos " + get_errmsg('NAGR'))

@app.route('/api/v1/todos-management/all-todo-labels',methods=['GET'])
def get_todo_labels_for_user():
    if request.method == 'GET':
        print('In Get get_todo_labels_for_user')
        try:
            user_id=request.args.get('user_id')
            label_id=request.args.get('label_id')
            jdb=JirigoTodos({'user_id':user_id,'label_id':label_id})
            data=jdb.get_todo_labels_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_todo_labels_for_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_todo_labels_for_user " + get_errmsg('NAGR'))

@app.route('/api/v1/todos-management/labels-filtered',methods=['GET'])
def get_all_todos_for_user_filtered_by_label():
    if request.method == 'GET':
        print('In Get get_all_todos_for_user_filtered_by_label')
        try:
            user_id=request.args.get('user_id')
            limit=request.args.get('limit')
            offset=request.args.get('offset')
            jdb=JirigoTodos({'user_id':user_id})
            data=jdb.get_all_todos_for_user_filtered_by_label()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_todos_for_user_filtered_by_label {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_todos_for_user_filtered_by_label " + get_errmsg('NAGR'))

@app.route('/api/v1/todos-management/status-filtered',methods=['GET'])
def get_all_todos_for_user_filtered_by_status():
    if request.method == 'GET':
        print('In Get get_all_todos_for_user_filtered_by_label')
        try:
            user_id=request.args.get('user_id')
            todo_status=request.args.get('todo_status')
            limit=request.args.get('limit')
            offset=request.args.get('offset')
            jdb=JirigoTodos({'user_id':user_id,'todo_status':todo_status})
            data=jdb.get_all_todos_for_user_filtered_by_status()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_todos_for_user_filtered_by_status {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_todos_for_user_filtered_by_status " + get_errmsg('NAGR'))


@app.route('/api/v1/todos-management/all-todos-by-interval',methods=['GET'])
def get_todos_for_user_by_interval():
    if request.method == 'GET':
        print('In Get get_todos_for_user_by_interval')
        try:
            user_id=request.args.get('user_id')
            interval_days=request.args.get('interval_days')
            limit=request.args.get('limit')
            offset=request.args.get('offset')
            jdb=JirigoTodos({'user_id':user_id,'interval_days':interval_days})
            data=jdb.get_todos_for_user_by_interval()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_todos_for_user_by_interval {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_todos_for_user_by_interval " + get_errmsg('NAGR'))

@app.route('/api/v1/todos-management/todo',methods=['POST'])
def create_todo_for_user():
    if request.method == 'POST':
        print('In Post create_todo_for_user')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.create_todo_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_todo_for_user {error}')
            return get_jsonified_error_response('Failure create_todo_for_user',error)
    else:
        return get_jsonified_error_response('Failure', "create_todo_for_user " + get_errmsg('NAPR'))

@app.route('/api/v1/todos-management/todo',methods=['PUT'])
def upd_todo_for_user():
    if request.method == 'PUT':
        print('In Post upd_todo_for_user')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.upd_todo_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in upd_todo_for_user {error}')
            return get_jsonified_error_response('Failure upd_todo_for_user',error)
    else:
        return get_jsonified_error_response('Failure', "upd_todo_for_user " + get_errmsg('NAPUR'))

@app.route('/api/v1/todos-management/todo',methods=['DELETE'])
def del_todo_for_user():
    if request.method == 'DELETE':
        print('In DELETE del_todo_for_user')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.del_todo_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in del_todo_for_user {error}')
            return get_jsonified_error_response('Failure del_todo_for_user',error)
    else:
        return get_jsonified_error_response('Failure', "del_todo_for_user " + get_errmsg('NADR'))

@app.route('/api/v1/todos-management/label',methods=['POST'])
def create_label_for_todo():
    if request.method == 'POST':
        print('In POST create_label_for_todo')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.create_label_for_todo()
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_label_for_todo {error}')
            return get_jsonified_error_response('Failure create_label_for_todo',error)
    else:
        return get_jsonified_error_response('Failure', "create_label_for_todo " + get_errmsg('NADR'))

@app.route('/api/v1/todos-management/label',methods=['DELETE'])
def del_label_for_todo():
    if request.method == 'DELETE':
        print('In DELETE del_label_for_todo')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.del_label_for_todo()
            return jsonify(data)
        except Exception as error:
            print(f'Error in del_label_for_todo {error}')
            return get_jsonified_error_response('Failure del_label_for_todo',error)
    else:
        return get_jsonified_error_response('Failure', "del_label_for_todo " + get_errmsg('NADR'))

@app.route('/api/v1/todos-management/user-categories',methods=['GET'])
def get_todo_categories_for_user():
    if request.method == 'GET':
        print('In Get get_todo_categories_for_user')
        try:
            user_id=request.args.get('user_id')
            print(user_id)
            jdb=JirigoTodos({'user_id':user_id})
            data=jdb.get_todo_categories_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_todo_categories_for_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_todo_categories_for_user " + get_errmsg('NAGR'))

@app.route('/api/v1/todos-management/category',methods=['POST'])
def create_category_for_user():
    if request.method == 'POST':
        print('In Post create_category_for_user')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.create_category_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in create_category_for_user {error}')
            return get_jsonified_error_response('Failure create_category_for_user',error)
    else:
        return get_jsonified_error_response('Failure', "create_category_for_user " + get_errmsg('NAPR'))

@app.route('/api/v1/todos-management/category',methods=['PUT'])
def upd_category_for_user():
    if request.method == 'PUT':
        print('In PUT upd_category_for_user')
        print(request.get_json())
        try:
            jdb=JirigoTodos(request.get_json())
            data=jdb.upd_category_for_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in upd_category_for_user {error}')
            return get_jsonified_error_response('Failure upd_category_for_user',error)
    else:
        return get_jsonified_error_response('Failure', "upd_category_for_user " + get_errmsg('NAPUR'))


@app.route('/api/v1/sprint-dashboard/attributes-summary',methods=['GET'])
def get_all_tasks_attribute_summary():
    if request.method == 'GET':
        print('In Get get_all_tasks_attribute_summary')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_all_tasks_attribute_summary()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_all_tasks_attribute_summary {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_all_tasks_attribute_summary " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-dashboard/efforts-summary',methods=['GET'])
def get_sprint_efforts_summary():
    if request.method == 'GET':
        print('In Get get_sprint_efforts_summary')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_sprint_efforts_summary()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_sprint_efforts_summary {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_sprint_efforts_summary " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-dashboard/sprint-task-count-user',methods=['GET'])
def get_sprint_num_tasks_by_user():
    if request.method == 'GET':
        print('In Get get_sprint_num_tasks_by_user')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_sprint_num_tasks_by_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_sprint_num_tasks_by_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_sprint_num_tasks_by_user " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-dashboard/sprint-task-activity-actuals',methods=['GET'])
def get_task_actuals_by_activity():
    if request.method == 'GET':
        print('In Get get_task_actuals_by_activity')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_task_actuals_by_activity()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_actuals_by_activity {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_actuals_by_activity " + get_errmsg('NAGR'))


@app.route('/api/v1/sprint-dashboard/sprint-task-estimated-vs-actuals',methods=['GET'])
def get_task_estimated_vs_actual_efforts():
    if request.method == 'GET':
        print('In Get get_task_estimated_vs_actual_efforts')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_task_estimated_vs_actual_efforts()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_task_estimated_vs_actual_efforts {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_task_estimated_vs_actual_efforts " + get_errmsg('NAGR'))


@app.route('/api/v1/sprint-dashboard/burndown-chart',methods=['GET'])
def get_sprint_burndown_chart_data():
    if request.method == 'GET':
        print('In Get get_sprint_burndown_chart_data')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_sprint_burndown_chart_data()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_sprint_burndown_chart_data {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_sprint_burndown_chart_data " + get_errmsg('NAGR'))

@app.route('/api/v1/sprint-dashboard/sprint-workloadby-user',methods=['GET'])
def get_sprint_workload_by_user():
    if request.method == 'GET':
        print('In Get get_sprint_workload_by_user')
        try:
            sprint_id=request.args.get('sprint_id')
            print(sprint_id)
            jdb=JirigoSprintDashboard({'sprint_id':sprint_id})
            data=jdb.get_sprint_workload_by_user()
            return jsonify(data)
        except Exception as error:
            print(f'Error in get_sprint_workload_by_user {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"get_sprint_workload_by_user " + get_errmsg('NAGR'))

@app.route('/api/v1/global-search',methods=['GET'])
def global_search():
    if request.method == 'GET':
        print('In Get global_search')
        try:
            search_text=request.args.get('search_text')
            print(search_text)
            jdb=JirigoGlobalSearch({'search_text':search_text})
            data=jdb.global_search()
            return jsonify(data)
        except Exception as error:
            print(f'Error in global_search {error}')
            return get_jsonified_error_response('Failure',error)
    else:
        return get_jsonified_error_response('Failure',"global_search " + get_errmsg('NAGR'))


def get_errmsg(mesg_code) :
    error_messages={
        "NAPR":"Not a POST Request",
        "NAGR":"Not a GET Request",
        "NAPUR":"Not a PUT Request",
        "NAPAR":"Not a PATCH Request",
        "NADR":"Not a DELETE Request"
    }
    return error_messages.get(mesg_code,'Not a Valid HTTP Request')

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
    try:
        error_response['dbQryResponse']['error_code']=error.pgcode
        error_response['dbQryResponse']['error_message']=error.pgerror[:60]
        return jsonify(error_response)
    except Exception as e:
        print("E reached in get_jsonified_error_response")
        error_response['dbQryResponse']['error_code']="Not A DB Error"
        error_response['dbQryResponse']['error_message']=error+':'+e
        print(error_response)
        print("------")
        return make_response(jsonify(error_response),200)

if  __name__ == 'jirigo_engine':
    test_if_db_up=JirigoDBConn()
    test_if_db_up.close_conn()
elif __name__=='__main__' :
    test_if_db_up=JirigoDBConn()
    test_if_db_up.close_conn()
    app.run()
