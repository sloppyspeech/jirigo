import { TaskDetailsService } from './../../../services/tasks/task-details.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SprintDetailsService  } from '../../../services/sprints/sprint-details.service';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.css']
})
export class CreateSprintComponent implements OnInit {
  // @ViewChild('sprintName') sprintName:ElementRef;
  sprintName;
  sprintNameCharsRemaining: number = 50;
  sprintNameCharLimit: number = 50;

  sourceTasks = [];
  targetTasks = [];
  sprintTasks=[];

  sprintPostData=[];

  sprintData;
  displayConfirmSprintNameModal: boolean = false;
  displayDialogForNoTasksSelected:boolean=false;
  showNoSprintNameEnteredDiag:boolean=false;


  constructor(private _serTasks: TaskDetailsService,
              private _serSprintDets:SprintDetailsService) { } 

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.getAllNotClosedTasks();
  }

  getAllNotClosedTasks() {
    console.log('getAllNotClosedTasks');
    this._serSprintDets.getAllNotClosedTasksByProjForSprint(localStorage.getItem('currentProjectName'))
      .subscribe(res => {
        console.log("List of ALl Tasks ");
        console.log(JSON.stringify(res));
        this.sourceTasks = res['dbQryResponse'];
        console.log(this.sourceTasks);
      });
  }

  showSprintNameDialog() {
    if (this.targetTasks.length <1 ){
      this.showNoTasksSelectedDialog();
    }
    else {
      this.displayConfirmSprintNameModal = true;
      this.sprintNameCharsRemaining = 50;
      console.log(this.sourceTasks);
      console.log("--------------------");
      console.log(this.targetTasks);
    }
  }

  createSprint() {
    this.sprintTasks=[];
    console.log("-----------createSprint Start------------");
    console.log("********* :["+this.sprintName+"]");
    console.log("********* :"+this.sprintName?.length);
    if (this.sprintName !== undefined && this.sprintName.length !=0){
      console.log(this.sprintName);
      console.log(this.targetTasks);
      this.targetTasks.forEach(val=>{
        // console.log(val);
        this.sprintTasks.push(val['task_no']);
      });
      console.log(this.sprintTasks);
      this.displayConfirmSprintNameModal = false;
      this.showNoSprintNameEnteredDiag=false;
      this.sprintData={
        'project_name':localStorage.getItem('currentProjectName'),
        'sprint_name':this.sprintName,
        'sprint_tasks':this.sprintTasks,
        'created_by':localStorage.getItem('loggedInUserId'),
      };
      this._serSprintDets.createSprintWithTasks(this.sprintData)
          .subscribe(res=>{
              console.log("---------------------");
              console.log(res);
          });
    }
    else{
      this.displayConfirmSprintNameModal = true;
      this.showNoSprintNameEnteredDiag=true;
    }
    console.log("------------createSprint End-----------");
  }

  countInputTextChars() {
    this.showNoSprintNameEnteredDiag=false;
    // console.log(this.sprintName.el.nativeElement.);
    // console.log(this.sprintName.length);
    this.sprintNameCharsRemaining = this.sprintNameCharLimit - this.sprintName.length;
  }

  cancelSprintName() {
    this.displayConfirmSprintNameModal = false;
    this.sprintName = "";
  }

  sprintNameModalOnHide() {
    alert("sprintNameModalOnHide");
  }

  showNoTasksSelectedDialog(){
    this.displayDialogForNoTasksSelected=true;
  }

  closeNoTasksSelectedDialog(){
    this.displayDialogForNoTasksSelected=false;
  }

}
