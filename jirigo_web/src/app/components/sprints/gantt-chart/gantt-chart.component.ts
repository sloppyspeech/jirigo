import { ActivatedRoute } from '@angular/router';
import { Component, OnInit,Input,Output,ViewChild,ElementRef } from '@angular/core';
import { UtilsService } from '../../../services/shared/utils.service';
import { SprintDetailsService } from './../../../services/sprints/sprint-details.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit {
  
  showTaskDetails:any[]=[];
  ganttChartDispData:any[]=[];

  ganttHeaderDates:any[]=[];
  tableau20Palette = ['#4E79A7', '#A0CBE8', '#F28E2B', '#FFBE7D', '#59A14F', '#8CD17D', 
                      '#B6992D', '#F1CE63', '#499894', '#86BCB6', '#E15759', '#FF9D9A', 
                      '#79706E', '#BAB0AC', '#D37295', '#FABFD2', '#B07AA1', '#D4A6C8', 
                      '#9D7660', '#D7B5A6'];
  
  assigneeColors={};
  sprintId;
  sprintName;

  constructor(
    private _serUtils:UtilsService,
    private _activatedRoute:ActivatedRoute,
    private _serSprintDetails:SprintDetailsService,
    private _serNgxSpinner:NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this._serNgxSpinner.show();
    this.sprintId=this._activatedRoute.snapshot.queryParamMap.get('sprint_id');
    this.sprintName=this._activatedRoute.snapshot.queryParamMap.get('sprint_name');
    this._serSprintDetails.getSprintDataForGantt(this.sprintId)
        .subscribe(res=>{
          console.log('gantt Chart');
          console.log(res);
          if (res['dbQryResponse'] && res['dbQryStatus'] == "Success"){
            this.ganttChartDispData=res['dbQryResponse'];
            this.showGantt();
          }
          this._serNgxSpinner.hide();
        });
  }

  showGantt(){
    let sprintStartDate;
    let sprintEndDate;
    let startDate;
    let endDate;
    

    this.allocateColorsToAssignees();
    console.log('-----------------Dates Start------------------------');
    
    for(let i=0;i<this.ganttChartDispData.length;i++){
      sprintStartDate=this.ganttChartDispData[i]['sprint_start_date'];
      sprintEndDate=this.ganttChartDispData[i]['sprint_end_date'];
      startDate=this.ganttChartDispData[i]['start_date'];
      endDate=this.ganttChartDispData[i]['end_date'];
      this.ganttChartDispData[i]['days']=this.getTaskWorkScheduledDates(sprintStartDate, sprintEndDate,startDate,endDate);
    }
    this.ganttHeaderDates=this._serUtils.getDatesArrayForADateRange(sprintStartDate, sprintEndDate);
    console.table(this.ganttChartDispData);
    console.log('-----------------Dates End------------------------');
  }

  /*
  ** Assign Colors to assignees on gantt chart
  */
  allocateColorsToAssignees(){
    let assignees=[];

    // create list of unique devs
    for (let i=0;i<this.ganttChartDispData.length;i++){
      if(!assignees.includes(this.ganttChartDispData[i]['assignee'])){
        assignees.push(this.ganttChartDispData[i]['assignee']);
      }
    }
    console.log(assignees);

    // Assign Colors to individuals
    for (let i=0;i<assignees.length;i++){
      this.assigneeColors[assignees[i]]=this.tableau20Palette[i];
    }
    console.log(this.assigneeColors);
  }

  /* 
  ** Generate the dates array for each task with dates falling 
  ** in between task start and end date as true else false.
  */
  getTaskWorkScheduledDates(pSprintStartDate,pSprintEndDate,pTaskStartDate,pTaskEndDate){
    console.log('getTaskDates');
    let sprintStartDate= new Date(pSprintStartDate);
    let sprintEndDate= new Date(pSprintEndDate);
    let taskStartDate= new Date(pTaskStartDate);
    let taskEndDate= new Date(pTaskEndDate);
    let taskWorkDates:any[]=[];
    console.log(taskEndDate);

    let idx=0;
    while(true){
     let tempDate=new Date(sprintStartDate);
       tempDate.setDate(sprintStartDate.getDate()+idx)
       // console.log(`${tempDate} : ${sprintEndDate}`);
       
       if (tempDate.getTime()>= taskStartDate.getTime() && tempDate.getTime() <= taskEndDate.getTime()){
         taskWorkDates.push({'sprintDate':tempDate,'isTaskScheduledDay':true});
       }
       else{
         taskWorkDates.push({'sprintDate':tempDate,'isTaskScheduledDay':false});
       }

       if (tempDate.getTime() == sprintEndDate.getTime()){
         break;
       }
     idx++;
    }

    console.log(taskWorkDates);
    return taskWorkDates;
  }

  showHideTaskDetails(taskNo,showHide){
    console.log(`${taskNo} : ${showHide}`);
    this.showTaskDetails.forEach(e => {
      this.showTaskDetails[e]=false;
    });
    this.showTaskDetails[taskNo]=showHide;
  }
  
}
