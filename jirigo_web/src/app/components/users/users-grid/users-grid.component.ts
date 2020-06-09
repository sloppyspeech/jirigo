import { ProjectsService } from './../../../services/projects/projects.service';
import { RolesService } from './../../../services/roles/roles.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService  } from 'ngx-spinner';
import { UsersService } from './../../../services/users/users.service';
import { faPencilAlt,faEdit,faCogs,faRegistered } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.css']
})
export class UsersGridComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faEdit=faEdit;
  faCogs=faCogs;
  faRegistered=faRegistered;
  showUserGrid:boolean=false;
  userEmailForPwdChange:string='';
  userEmailForRoleAssignment:string='';
  allRolesList:roleValues[]=[];
  modifiedRoles:roleValues[]=[];
  selectedRoleId:number=0;
  projectList:projectValues[]=[];
  selectedProjectId:number=0;
  selectedUserId:number=0;

  
  newPassword='';

  cols:any[] = [
    { field: 'first_name', header: 'First Name',width:'13%' },
    { field: 'last_name', header: 'Last Name' ,width:'13%' },
    { field: 'email', header: 'Email' ,width:'25%' },
    { field: 'is_active', header: 'Active ' ,width:'10%' },
    { field: 'password_change_date', header: 'Password Change Date' ,width:'15%' }
];

  users:any[]=[];

  constructor(private _serNgxSpinner:NgxSpinnerService,
              private _serUsers:UsersService,
              private _serRoles:RolesService,
              private _serProjects:ProjectsService
             ) { }


  ngOnInit(): void {
    this.populateProjectDropDown();
    this.loadUserDetails();

  }

  openChangePasswordModal(userDetails){
    this.userEmailForPwdChange=userDetails.email;
    console.log(userDetails);
  }

  assignRolesToUser (userDetails){
    this.userEmailForRoleAssignment=userDetails.email;
    this.selectedUserId=userDetails.user_id;
    this.selectedProjectId=0;
    this.allRolesList=[];
    console.log(userDetails);
    console.log(this.selectedUserId);
    
  }
  populateProjectDropDown(){
    this.projectList=[];
    this._serProjects.getAllProjects()
        .subscribe(res=>{
            if(res['dbQryStatus'] && res['dbQryStatus'] == "Success"){
              console.log(res);
              res['dbQryResponse'].forEach(e=>{
                this.projectList.push({'project_id': e.project_id,'project_name':e.project_name});
              })
            }
        });
  }

  getAllActiveRoles(){
    let inpData={
      'project_id':this.selectedProjectId,
      'user_id':this.selectedUserId
    };
    this._serRoles.getRolesForUserAssignment(inpData)
        .subscribe(res=>{
          if(res['dbQryStatus'] && res['dbQryStatus'] == "Success"){
            console.log(res);
            res['dbQryResponse'].forEach(e=>{
               this.allRolesList.push({'user_id': e.user_id,'role_id': e.role_id,'role_name':e.role_name,'project_id': e.project_id,'project_name':e.project_name,'is_default':e.is_default=='Y' ? true:false,'assigned':e.email ? true:false});
            });
          }
        });
  }

  changePassword(){
    let inpData={
      'email':this.userEmailForPwdChange,
      'password':this.newPassword,
      'modified_by':localStorage.getItem('loggedInUserId')
    };
    console.log(inpData);
    this._serUsers.setPassword(inpData)
        .subscribe(res=>{
          console.log('================');
          console.log(res);
          if(res['dbQryStatus'] == "Success"){
            this.loadUserDetails();
          }
        });
  }

  loadUserDetails(){
    this._serUsers.getAllActiveUsers()
    .toPromise()
    .then(res=>{
        console.log("In Service Get All Active Users");
        console.log(res);
        if (res['dbQryStatus'] == "Success"){
          this.users=res['dbQryResponse'];
        }
    })
    .catch(err=>{
      console.log("In Service Get All Active Users ERRORs");
      console.log(err);
    });
  }

  toggleUserActiveStatus(userDetails){
    let inpData={
      'user_id': userDetails.user_id,
      'is_active':userDetails.is_active == 'N' ? 'Y' : 'N',
      'modified_by':localStorage.getItem('loggedInUserId')
    }
    console.log(userDetails);
    console.log(inpData);
    this._serUsers.activateInactivateUser(inpData)
        .subscribe(res=>{
          console.log(res);
          this.loadUserDetails();
        });
  }
  
  
  onDefaultRoleSet(rowIdx){
    console.log(rowIdx);
    for(let i=0;i<this.allRolesList.length;i++){
      if (i!=rowIdx){
        this.allRolesList[i]['is_default']=false;
      }
      else{
        this.allRolesList[i]['is_default']=true;
      }
    }
    console.log(this.allRolesList);
  }

  addRoleToUser(){
    let tempRolesList:roleValues[]=[];
    this.allRolesList.forEach(e=>{
        if(e.assigned){
          tempRolesList.push(e);
        }
    });
    if (this.allRolesList.length>0) {
      let inpdata={
        'project_id':this.selectedProjectId,
        'user_id':this.selectedUserId,
        'new_roles_values':tempRolesList,
        'created_by':localStorage.getItem('loggedInUserId')
      };
      this._serRoles.assignRolesToUser(inpdata)
          .subscribe(res=>{
            console.log(res);
          });
  }
      console.log(this.allRolesList);
      console.log(tempRolesList);
  }

}

interface roleValues{
  user_id:number,
  role_id:number,
  role_name:string,
  project_id:number,
  project_name:string,
  is_default:boolean,
  assigned:boolean
};
interface projectValues{
  project_id:number,
  project_name:string
};