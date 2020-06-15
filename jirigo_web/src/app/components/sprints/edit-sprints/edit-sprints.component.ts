import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';

import {  SprintDetailsService  } from '../../../services/sprints/sprint-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-edit-sprints',
  templateUrl: './edit-sprints.component.html',
  styleUrls: ['./edit-sprints.component.css']
})
export class EditSprintsComponent implements OnInit {
  showPicklistTable:boolean=false;
  displayDialogForNoTasksSelected:boolean=false;
  header_sprint_name:string;


  sourceSprintTasks:any=[];
  targetSprintTasks:any=[];
  updatedSprintTasks:any=[];
  updatedSprintData:any;
  sprintId:string;

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

  constructor(
    private _serSprintDetails:SprintDetailsService,
    private _router:Router,
    private _activatedRoute:ActivatedRoute,
    private _serNgxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.sourceSprintTasks=[];
    this.targetSprintTasks=[];
    this.header_sprint_name="";

    console.log("Inside Edit Sprints NgOnAfterViewInit");
    this.sprintId=this._activatedRoute.snapshot.queryParamMap.get('sprint_id')
    console.log("Getting the details for Sprint Id:"+this.sprintId);

    this._serSprintDetails.getAllNotClosedTasksByProjForSprint(localStorage.getItem("currentProjectName"))
        .subscribe(response=>{
          console.log("------------getAllNotClosedTasksByProjForSprint----------------");
          console.log(response);
          this.sourceSprintTasks = response['dbQryResponse'];
          console.log(this.sourceSprintTasks);

          this._serSprintDetails.getAllTasksForASprint(this.sprintId)
          .subscribe(res =>{
              console.log("-----------------getAllTasksForASprint-------------------");
              console.log(res);
              this.targetSprintTasks=res['dbQryResponse'];
              if (res['dbQryStatus'] == "Success" && res['dbQryResponse'].length>0){
                this.header_sprint_name=res['dbQryResponse'][0]['sprint_name'];
              }
              console.log(this.targetSprintTasks);
          });

        });
  }

  backToSprintList(){
    this.sourceSprintTasks=[];
    this.targetSprintTasks=[];
    this.sprintId="";
    this._router.navigate(['sprints/list-sprints']);
  }

  saveSprintTasks(){
    this.updatedSprintTasks=[];
    console.log("In saveSprintTasks");
    console.log(this.targetSprintTasks);
    this.targetSprintTasks.forEach(val => {
      console.log(val);
      this.updatedSprintTasks.push(val['task_no']);
    });

    console.log(this.updatedSprintTasks);

    this.updatedSprintData={
      'project_name':localStorage.getItem('currentProjectName'),
      'sprint_id':this.sprintId,
      'sprint_tasks':this.updatedSprintTasks,
      'created_by':localStorage.getItem('loggedInUserId'),
    };

    this.modalAlertConfig.cancelButtonLabel="";
    this.modalAlertConfig.confirmButtonLabel="Ok";
    this.modalAlertConfig.dialogConfirmed="SprintUpdateModalConfirm";
    this.modalAlertConfig.dialogCanceled="SprintUpdateModalClosed";
    this.modalAlertConfig.dialogClosed="SprintUpdateModalClosed";
  
    this._serNgxSpinner.show();
  
    this._serSprintDetails.updateSprintTasks(this.updatedSprintData)
        .subscribe(res=>{
            console.log("-----------updateSprintTasks----------");
            console.log(res);
            if (res['dbQryStatus'] == 'Success'){
              this._serNgxSpinner.hide();
    
              //---
              this.modalAlertConfig.dialogConfirmed="SprintUpdateModalSuccessConfirm";
              this.modalAlertConfig.title="Success";
              this.modalAlertConfig.modalContent= "Sprint updated successfully";
              this.modalAlertConfig.modalType="success";
              this.modalAlertConfig.showModal=true;
              //---
    
            }
            else{
              this._serNgxSpinner.hide(); 
              this.modalAlertConfig.dialogConfirmed="SprintUpdateModalFailureConfirm";
              this.modalAlertConfig.title="Failure";
              this.modalAlertConfig.modalContent=" Sprint update failed. Contact Adminstrator.";
              this.modalAlertConfig.modalType="danger";
              this.modalAlertConfig.showModal=true;
            }
        });
  } 

  modalAlertAction(action){
    this.modalAlertConfig.showModal=false;
    this.modalAlertConfig.modalType='';
    this.modalAlertConfig.modalContent='';
  }

}
