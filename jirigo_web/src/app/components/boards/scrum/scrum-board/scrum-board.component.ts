import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';

import { SprintDetailsService  }  from '../../../../services/sprints/sprint-details.service';
import { ScrumBoardService  } from '../../../../services/boards/scrum/scrum-board.service';
import { ProjectWorkflowsService } from './../../../../services/workflows/project-workflows.service';
import { TaskDetailsService } from './../../../../services/tasks/task-details.service';

@Component({
  selector: 'app-scrum-board',
  templateUrl: './scrum-board.component.html',
  styleUrls: ['./scrum-board.component.css'],
  host: {
    '(document:click)': 'closeNewTaskStatusBtnGroup($event)',
  }
})
export class ScrumBoardComponent implements OnInit {
  @ViewChild('newTaskStatusBtnGroup') newTaskStatusBtnGroup:ElementRef;
  sprint_id:string;
  sprint_name:string;
  tSprintTasks:any[]=[];
  tSprintUpdatedTasks:any[]=[];
  tBoardStepsDisplayName:any[]=[];
  tBoardStepsName:any[]=[];
  showBoard:boolean=false;
  sourceStep:any;
  targetStep:any;
  draggedTaskDivId:any;
  draggedTask:string;
  boardStepsVals:any[];
  stepNameFC:FormControl;
  showNextTaskStatuses:any[]=[];
  nextTaskStatuses:any[]=[];
  showNextTaskStatusesEle:boolean=false;

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
    private _router:Router,
    private _activatedRoute : ActivatedRoute,
    private _serSprintDetails:SprintDetailsService,
    private _serScrumBoard:ScrumBoardService,
    private _serNgxSpinner:NgxSpinnerService,
    private _serProjectWorkflow:ProjectWorkflowsService,
    private _serTaskDetails:TaskDetailsService
  ) { }

  ngOnInit(): void {
    this.getAndPopulateScrumBoardData();
  }

  getAndPopulateScrumBoardData(){
    let tStep:string='';
    this.sprint_id=this._activatedRoute.snapshot.queryParamMap.get("sprint_id");
    this.sprint_name=this._activatedRoute.snapshot.queryParamMap.get("sprint_name");
    console.log("Inside Init sprint_id :"+this.sprint_id);
    console.log("Inside Init sprint_name :"+this.sprint_name);
    this._serScrumBoard.getAllTasksOfASprintForScrumBoard(this.sprint_id)
        .subscribe(res =>{
          // console.log("getAllTasksOfASprintForScrumBoard Response is :");
          console.log(res['dbQryResponse']);
          if(res['dbQryResponse'] && res['dbQryStatus'] == "Success"){
            res['dbQryResponse'].forEach(tasks => {
              tStep=Object.keys(tasks).toString();
              // console.log(tStep);
              // console.log(tasks[tStep]);
              // console.log(tasks[tStep].length);

              let refKey=tasks[tStep][0]['ref_key']

              // When a step doesn't have any task, the query from DB returns
              // an empty array ,we just delete that one.
              if (!tasks[tStep][0]['issue_status']){
                  tasks[tStep]=[];
              }

              //Initial display flag for Status edit button
              tasks[tStep].forEach(t=>{
                this.showNextTaskStatuses[t.task_no]=false;
              });
              this.tSprintTasks.push(tasks);
              this.tBoardStepsName.push({'stepName':tStep,[tStep]:refKey});
              this.tBoardStepsDisplayName.push(tStep.substring(tStep.indexOf('$')+1));
              // console.log(Object.keys(tasks))
            });
          }
          this.showBoard=true;
          console.log(this.tSprintTasks);
          console.log(this.tBoardStepsName);
          console.log(this.tBoardStepsDisplayName);
          console.log(JSON.stringify(this.showNextTaskStatuses));
        });
  }

  getRefKey(stepName){
    let refKey='';
    for(let i=0;i<this.tBoardStepsName.length;i++){
      if (this.tBoardStepsName[i][stepName]){
          refKey=this.tBoardStepsName[i][stepName];
          break;
      }
    }
    return refKey;
  }

  getTaskCountForStep(step){
    let i=0;
    for ( i=0;i < this.tSprintTasks.length;i++){
      if (this.tSprintTasks[i][step]){
        break;
      }
    }
    return this.tSprintTasks[i][step].length;
  }

  addElementAtIndex(arr,ele,idx){
    return arr.splice(idx,0,ele);
  }
  
  removeElementAtIndex(arr,idx){
    return arr.splice(arr,1,idx);
  }
  
  setNewStepName(stepName){
    console.log(stepName);
    console.log(this.tBoardStepsName);
    console.log(this.getRefKey(stepName));
  }

  setNewTaskStatus(taskNo,status,stepName){
    let stepNameIdx=stepName.substring(0,stepName.indexOf('$'))-1;
    let inpData={
      'task_no':taskNo,
      'modified_by':localStorage.getItem('loggedInUserId'),
      'issue_status':status
    };
    console.log(taskNo + ':' + status+"  :  "+stepName +"   : "+stepNameIdx);
    console.log(this.tSprintTasks[stepNameIdx][stepName]);
    for(let i=0;i<this.tSprintTasks[stepNameIdx][stepName].length;i++){
      console.log(this.tSprintTasks[stepNameIdx][stepName][i]['issue_status']);
      if (
            this.tSprintTasks[stepNameIdx][stepName][i]['task_no'] == taskNo &&
            this.tSprintTasks[stepNameIdx][stepName][i]['issue_status'] != status
          ){
        this._serTaskDetails.updateTaskStatus(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryResponse'] && res['dbQryStatus']=="Success"){
            console.log('All Okay');
            this.tSprintTasks[stepNameIdx][stepName][i]['issue_status']=status;
            this.showNextTaskStatusesEle=true;
          }
        })
        break;
      }
    }
    this.showNextTaskStatuses[taskNo]=false;
  }

  openTaskStatusModifier(taskNo,taskStatus){
    this.nextTaskStatuses=[];
    let inpData={
      'project_id':localStorage.getItem('currentProjectId'),
      'role_id':localStorage.getItem('loggedInUserRoleId'),
      'current_status':taskStatus
    };
    this._serProjectWorkflow.getNextAllowedStepsForProjectRoleCurrStatus(inpData)
        .subscribe(res=>{
            if(res['dbQryResponse'] && res['dbQryStatus']=="Success"){
              this.showNextTaskStatuses[taskNo]=true;
              this.nextTaskStatuses=res['dbQryResponse'];
            }
        })
  }

/** 
 * Find Element in the original tasks JSON. Structure of the JSON is 
 * [  { "taskStatus1":[
 *                    {task1Detail,task2Detail,...}
 *                  ]
 *    },
 *    { "taskStatus2":[
 *                    {task1Detail,task2Detail,...}
 *                  ]
 *    }
 * ]
 * 
 * Function returns the index of Task status and the index of the 
 * task in the JSON.
 * When the task field is blank, the function returns the index of 
 * task status
 * 
 * **/
findElement(arr,step,task?){
  console.log("----------findElement------------");
  let index='';
  console.log(arr);
  console.log("["+step+"]");
  console.log("["+task+"]");  
    for(var i=0;i<arr?.length;i++){
      console.log(i+":"+ arr[i][step]);
      if (task){
        for (var j=0;j<arr[i][step]?.length;j++){
          console.log(arr[i][step]);
          if(arr[i][step][j]['task_no'] == task){
            index=i+":"+j;
            console.log('findElement with Task ret val ['+index+"]");
            break;
          }
        }
      }
      else if (arr[i][step]){
        index=''+i;
        console.log('findElement with No Task ret val ['+index+"]");
        break;
      }
    }
return index;
}

dragStart(event) {  
    console.log('dragstart')
    console.log(event.target.id);
    this.draggedTaskDivId=event.target.id.toString().substring(event.target.id.toString().indexOf('_')+1);
    console.log(this.draggedTaskDivId);
    event
    .dataTransfer
    .setData('text/plain', event.target.id);

    event.dataTransfer.dropEffect = "move";
}



drop(event) {
  event.preventDefault();
  console.log('drop');
  console.log(event.target.id);
  console.log(this.draggedTaskDivId)
  this.targetStep=event.target.id.toString().substring(event.target.id.toString().indexOf('_')+1,event.target.id.toString().indexOf('#'));
  this.sourceStep=this.draggedTaskDivId.substring(0,this.draggedTaskDivId.indexOf('#'));
  this.draggedTask=this.draggedTaskDivId.substring(this.draggedTaskDivId.indexOf('#')+1);
  this.targetStep=this.targetStep.substring(this.targetStep.length-1) =='_' ? this.targetStep.substring(0,this.targetStep.length-1):this.targetStep
  console.log(this.targetStep.substring(0,this.targetStep.length-1));
  console.log(this.targetStep);
  console.log(this.sourceStep);
  console.log(this.draggedTask);

  let tEleIdxsToDel=this.findElement(this.tSprintTasks, this.sourceStep, this.draggedTask);
  console.log(tEleIdxsToDel);
  let tStepIdxToDel=tEleIdxsToDel.substring(0,tEleIdxsToDel.indexOf(':'))
  console.log(tStepIdxToDel);
  let tTaskIdxToDel=tEleIdxsToDel.substring(tEleIdxsToDel.indexOf(':')+1)
  console.log(tTaskIdxToDel);
  let tTargetStepIdxForAddition=this.findElement(this.tSprintTasks, this.targetStep);
  console.log(tTargetStepIdxForAddition);
  console.log(this.tSprintTasks[tStepIdxToDel]);

  // Add the Element in the target Array
  this.tSprintTasks[tTargetStepIdxForAddition][this.targetStep].push(this.tSprintTasks[tStepIdxToDel][this.sourceStep][tTaskIdxToDel]);
  
  // Delete the element from source array
  this.tSprintTasks[tStepIdxToDel][this.sourceStep].splice(tTaskIdxToDel,1);

  this.tSprintUpdatedTasks.push({ [this.draggedTask] : this.getRefKey(this.targetStep) });

  console.log('Updated Tasks');
  console.log(this.tSprintUpdatedTasks);
}

dragEnd(event) {
  // console.log('dragEnd')
  // console.log(event);
}

allowDrop(event){
event.preventDefault();
// console.log(event);
// console.log('allowDrop');
}

clearDrop(event){
  // console.log('clearDrop');
}

findIndex(car: any) {
    let index = -1;
    // for(let i = 0; i < this.availableCars.length; i++) {
    //     if (car.vin === this.availableCars[i].vin) {
    //         index = i;
    //         break;
    //     }
    // }
    // return index;
}

drag(event){
  event?.dataTransfer.setData("text/plain", event.target.id);
  // console.log(event) 
}

saveSprint(){
  let inpData={
    'sprint_id': this.sprint_id,
    'sprint_tasks':this.tSprintUpdatedTasks,
    'modified_by':localStorage.getItem('loggedInUserId')
  };

  this.modalAlertConfig.cancelButtonLabel="";
  this.modalAlertConfig.confirmButtonLabel="Ok";
  this.modalAlertConfig.dialogConfirmed="BoardUpdateModalConfirm";
  this.modalAlertConfig.dialogCanceled="BoardUpdateModalClosed";
  this.modalAlertConfig.dialogClosed="BoardUpdateModalClosed";

  this._serNgxSpinner.show();

  console.log(inpData);
  this._serScrumBoard.updateSprintStepsForScrumBoard(inpData)
      .subscribe(res=>{
        console.log(res);
        if (res['dbQryStatus'] == 'Success'){
          this._serNgxSpinner.hide();

          //---
          this.modalAlertConfig.dialogConfirmed="BoardUpdateModalSuccessConfirm";
          this.modalAlertConfig.title="Success";
          this.modalAlertConfig.modalContent= "Board updated successfully";
          this.modalAlertConfig.modalType="success";
          this.modalAlertConfig.showModal=true;
          //---

        }
        else{
          this._serNgxSpinner.hide(); 
          this.modalAlertConfig.dialogConfirmed="BoardUpdateModalFailureConfirm";
          this.modalAlertConfig.title="Failure";
          this.modalAlertConfig.modalContent=" Board update failed. Contact Adminstrator.";
          this.modalAlertConfig.modalType="danger";
          this.modalAlertConfig.showModal=true;
        }
      })
}
modalAlertAction(action){
  this.modalAlertConfig.showModal=false;
  this.modalAlertConfig.modalType='';
  this.modalAlertConfig.modalContent='';
}


closeNewTaskStatusBtnGroup(e){
  console.log('newTaskStatusBtnGroup');
  console.log(this.showNextTaskStatusesEle);
  console.log(e);
  if (this.showNextTaskStatusesEle=true){
    this.newTaskStatusBtnGroup?.nativeElement.click();
    this.showNextTaskStatusesEle=false;
  }
}

}
