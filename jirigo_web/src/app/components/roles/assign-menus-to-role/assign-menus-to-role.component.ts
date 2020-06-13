import { NgxSpinnerService } from 'ngx-spinner';
import { RolesService } from './../../../services/roles/roles.service';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './../../../services/projects/projects.service';
import { MenusService } from './../../../services/menus/menus.service';

@Component({
  selector: 'app-assign-menus-to-role',
  templateUrl: './assign-menus-to-role.component.html',
  styleUrls: ['./assign-menus-to-role.component.css']
})
export class AssignMenusToRoleComponent implements OnInit {
  selectedProjectId:number=0;
  selectedRoleId:number=0;
  projectList:projectValues[]=[];
  allRolesList:roleValues[]=[];
  filteredRolesList:roleValues[]=[];
  unAssignedMenus:menuItem[]=[];
  assignedMenus:menuItem[]=[];
  modalAlertConfig={
    modalType :'',
    showModal:false,
    title:'',
    modalContent:'',
    cancelButtonLabel:'',
    confirmButtonLabel:'',
    dialogCanceled:'',
    dialogConfirmed:'',
    dialogClosed:''
};
  constructor(private _serMenu:MenusService,
              private _serProjects:ProjectsService,
              private _serRoles:RolesService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.populateProjectDropDown();
    this.getAllActiveRoles();
    // this.populateMenuDetailsFromDB({'project_id':this.selectedProjectId,'role_id':this.selectedRoleId});
  }

  removeUndefined(){
    this.unAssignedMenus= this.unAssignedMenus.filter((e)=>{
      return e != undefined;
    });
    this.assignedMenus= this.assignedMenus.filter((e)=>{
      return e != undefined;
    });
  }

  populateProjectDropDown(){
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
    this._serRoles.getRolesActiveForAllProjects()
        .subscribe(res=>{
          if(res['dbQryStatus'] && res['dbQryStatus'] == "Success"){
            console.log(res);
            res['dbQryResponse'].forEach(e=>{
              this.allRolesList.push({'role_id': e.role_id,'role_name':e.role_name,'project_id': e.project_id});
            })
          }
        });
  }

  populateRolesDropDown(){
    this.filteredRolesList=[];
    this.allRolesList.forEach(e=>{
      if(e.project_id == this.selectedProjectId){
        this.filteredRolesList.push(e);
      }
    })
  }


  populateMenuDetailsFromDB(){
    let inpData={
      'project_id':this.selectedProjectId,
      'role_id':this.selectedRoleId
    };
    this._serMenu.getAllAssignedMenusForProjectRole(inpData)
    .subscribe(res=>{
      console.log(res);
      res['dbQryResponse'].forEach(e => {
                        this.assignedMenus.unshift({
                            'project_id':this.selectedProjectId,
                            'role_id':this.selectedRoleId,
                            'menu_id':e.menu_id,
                            'menu_url':e.menu_url,
                            'path':e.path,
                            'assigned':true
                        });

      });
      console.log(this.assignedMenus);
    });

this._serMenu.getAllUnassignedMenusForProjectRole(inpData)
    .subscribe(res=>{
      console.log(res);
      res['dbQryResponse']?.forEach(e => {
                        this.unAssignedMenus.unshift({
                            'project_id':this.selectedProjectId,
                            'role_id':this.selectedRoleId,
                            'menu_id':e.menu_id,
                            'menu_url':e.menu_url,
                            'path':e.path,
                            'assigned':false
                        });

      });
      console.log(this.unAssignedMenus);
    });
  }

  itemMoved(){
    this.removeUndefined();
    let ele;
    console.log("============itemsMoved=============");
    console.log(this.unAssignedMenus);
    console.log(this.assignedMenus);
    console.log("============itemsMoved=============");
    
    // By default the element moved between src & target go at the end
    // so we just swap first and last elements
    if (this.unAssignedMenus){
      ele=this.unAssignedMenus.pop()
      this.unAssignedMenus=[ele,...this.unAssignedMenus];
    }

    if (this.assignedMenus){
      ele=this.assignedMenus.pop()
      this.assignedMenus=[ele,...this.assignedMenus];
    }
    this.setItemColors()

  }

  allItemsMoved(){
    this.removeUndefined();
    let ele;
    console.log("============itemsMoved2=============");
    console.log(this.unAssignedMenus);
    console.log(this.assignedMenus);
    console.log("=============itemsMoved2============");

    this.setItemColors()

  }

  setItemColors(){
    if(this.unAssignedMenus[0]){
      this.unAssignedMenus?.forEach(e=>{
        e.assigned=false;
      });
    }

    if(this.assignedMenus[0]){
      this.assignedMenus?.forEach(e=>{
         e.assigned=true;
       });
    }

  }

  cancel(){
    this.selectedProjectId=0;
    this.selectedRoleId=0;
    this.filteredRolesList=[];
    this.assignedMenus=[];
    this.unAssignedMenus=[];
  }

  submit(){
    console.log("===========submit=========");
    let inpData={
      'role_id':this.selectedRoleId,
      'project_id':this.selectedProjectId,
      'created_by':localStorage.getItem('loggedInUserId'),
      'new_menu_items':this.assignedMenus
    };
    console.log(inpData);
    this.modalAlertConfig.cancelButtonLabel="";
    this.modalAlertConfig.confirmButtonLabel="Ok";
    this.modalAlertConfig.dialogConfirmed="RoleUpdateModalConfirm";
    this.modalAlertConfig.dialogCanceled="RoleUpdateModalClosed";
    this.modalAlertConfig.dialogClosed="RoleUpdateModalClosed";
    this._serNgxSpinner.show(); 
    this._serMenu.addMenusToRole(inpData)
        .subscribe(res=>{
          console.log(res);
          if (res['dbQryResponse'] && res['dbQryStatus']=="Success"){
            this._serNgxSpinner.hide(); 
            this.modalAlertConfig.dialogConfirmed="RoleUpdateModalSuccessConfirm";
            this.modalAlertConfig.title="Role Update Success";
            this.modalAlertConfig.modalContent="Role updated successfully";
            this.modalAlertConfig.modalType="success";
            this.modalAlertConfig.showModal=true;
          }
          else{
            this._serNgxSpinner.hide(); 
            this.modalAlertConfig.dialogConfirmed="RoleUpdateModalFailureConfirm";
            this.modalAlertConfig.title="Role Update Failed";
            this.modalAlertConfig.modalContent="Role update failed. Contact Adminstrator.";
            this.modalAlertConfig.modalType="danger";
            this.modalAlertConfig.showModal=true;
          }
        })
  }

  modalAlertAction(){
    this.modalAlertConfig.showModal=false;
  }

}

interface menuItem{
  project_id:number,
  role_id:number,
  menu_id:string,
  menu_url:string,
  path:string,
  assigned:boolean
};

interface projectValues{
  project_id:number,
  project_name:string
};

interface roleValues{
  role_id:number,
  role_name:string,
  project_id:number
};