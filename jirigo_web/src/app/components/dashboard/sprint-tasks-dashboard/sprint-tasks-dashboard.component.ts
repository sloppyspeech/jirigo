import { ActivatedRoute } from '@angular/router';
import { SprintTasksDashboardService } from '../../../services/dashboards/sprint-tasks-dashboard.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sprint-tasks',
  templateUrl: './sprint-tasks-dashboard.component.html',
  styleUrls: ['./sprint-tasks-dashboard.component.css']
})
export class SprintTasksDashboardComponent implements OnInit {
  showTable:boolean=false;
  showIssueTypesChart:boolean=false;
  showBurnDownChart:boolean=false;
  showSprintWorkloadByUser:boolean=false;
  sprintAttributes:any;
  sprintEfforts:any;
  issueTypeCounts:any;
  issueTypeLabels:any;

  issueTypeChartOptions:any;
  prioritiesChartOptions:any;
  severitiesChartOptions:any;
  burndownChartOptions:any;
  sprintWorkloadByUserChartOptions:any;
  
  sprintId:string="";
  sprintName:string="";

  constructor(
                private _serSprintTasksDashboard:SprintTasksDashboardService,
                private _activatedRoute:ActivatedRoute
              ) { }

  ngOnInit(): void {
    this.sprintId=this._activatedRoute.snapshot.queryParamMap.get('sprint_id')
    this.sprintName=this._activatedRoute.snapshot.queryParamMap.get('sprint_name')

    this._serSprintTasksDashboard.getTasksAttributesSummary(this.sprintId)
        .subscribe(res=>{
          this.sprintAttributes=res['dbQryResponse'][0];
          console.log(this.sprintAttributes);
          console.log(this.sprintAttributes['issue_types']);
          console.log(Object.keys(this.sprintAttributes['issue_types']));
          console.log(Object.values(this.sprintAttributes['issue_types']));
          
          this.issueTypeLabels=Object.keys(this.sprintAttributes['issue_types']);
          this.issueTypeCounts=Object.values(this.sprintAttributes['issue_types']);

          console.log(this.issueTypeCounts);
          console.log(this.issueTypeLabels);
          this.issueTypeChartOptions={
            chartType:'horizontalBar',
            barChartElementId:'id_issuetypeChart',
            barChartType:'horizontalBar',
            chartLabels:this.issueTypeLabels,
            chartData:this.issueTypeCounts,
            xAxisLabel:'Count',
            yAxisLabel:'Issue Types',
            yTickSuggestedMin:0,
            xTickSuggestedMin:0
          };
          console.log(Object.keys(this.sprintAttributes['priorities']));
          // let prioritiesSorted=Object.keys(this.sprintAttributes['priorities']).sort(function(a,b){return this.sprintAttributes['priorities'][a]-this.sprintAttributes['priorities'][b]});
          // console.log(prioritiesSorted);
          this.prioritiesChartOptions={
            chartType:'horizontalBar',
            barChartElementId:'id_priorityChart',
            barChartType:'horizontalBar',
            chartLabels:Object.keys(this.sprintAttributes['priorities']),
            chartData:Object.values(this.sprintAttributes['priorities']),
            xAxisLabel:'Count',
            yAxisLabel:'Priorities',
            yTickSuggestedMin:0,
            xTickSuggestedMin:0
          };
          this.severitiesChartOptions={
            chartType:'horizontalBar',
            barChartElementId:'id_severityChart',
            barChartType:'horizontalBar',
            chartLabels:Object.keys(this.sprintAttributes['severities']),
            chartData:Object.values(this.sprintAttributes['severities']),
            xAxisLabel:'Count',
            yAxisLabel:'Severity',
            yTickSuggestedMin:0,
            xTickSuggestedMin:0
          };
          console.log(this.severitiesChartOptions);
          this.showIssueTypesChart=true;
        });

    this._serSprintTasksDashboard.getTasksEffortsSummary(this.sprintId)
        .subscribe(res=>{
          this.sprintEfforts=res['dbQryResponse'][0];
          console.log(this.sprintEfforts);
          this.showTable=true;
        });

    this._serSprintTasksDashboard.getBurnDownChartData(this.sprintId)
        .subscribe(res=>{
          console.log(res['dbQryResponse']);
          if(res['dbQryStatus'] == "Success"){
            let burnDownChartLabels:string[]=[];
            let burnDownChartIdealLineValues:string[]=[];
            let burnDownChartActualLineValues:string[]=[];
            res['dbQryResponse'].forEach(e => {
                burnDownChartLabels.push(e['c_date2']);
                burnDownChartIdealLineValues.push(e['ideal_line']);
                burnDownChartActualLineValues.push(e['actuals']);
            });

            this.burndownChartOptions={
              chartElementId:'id_burndownChart',
              chartLabels:burnDownChartLabels,
              chartData:[burnDownChartIdealLineValues,burnDownChartActualLineValues],
              xAxisLabel:'Dates [Burndown Chart]',
              yAxisLabel:'Hours [Burndown Chart]',
              yTickSuggestedMin:0,
              xTickSuggestedMin:0,
              displayTitle:false,
              titleText:'Burndown Chart',
              multiple:true,
              legendLabels:['Estimated','Actual']
            };
          }
          this.showBurnDownChart=true;
        });


    this._serSprintTasksDashboard.getSprintWorkloadByUser(this.sprintId)
        .subscribe(res=>{
          let user:string[]=[];
          let workload:number[]=[];
          console.log(res['dbQryResponse']);
          if(res['dbQryStatus'] == "Success"){
            res['dbQryResponse'].forEach(e => {
              user.push(e['user_name']);
              workload.push(e['estimated_time']);
            });
            this.sprintWorkloadByUserChartOptions={
              chartType:'horizontalBar',
              barChartElementId:'id_sprintWorkloadByUser',
              barChartType:'horizontalBar',
              chartLabels:user,
              chartData:workload,
              xAxisLabel:'Workload in Hours',
              yAxisLabel:'User',
              yTickSuggestedMin:0,
              xTickSuggestedMin:0
            };
          }
          this.showSprintWorkloadByUser=true;
        });
  }

}