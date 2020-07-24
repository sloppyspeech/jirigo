import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SprintTasksDashboardService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"sprint-dashboard/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }

  getTasksAttributesSummary(sprint_id:string){
    let url=this.sApiEndPoint+`attributes-summary?sprint_id=${sprint_id}`;
    console.log('getTasksAttributesSummary');
    console.log(url);
    return this._httpCli.get(url);
      
  }

  getTasksEffortsSummary(sprint_id:string){
    let url=this.sApiEndPoint+`efforts-summary?sprint_id=${sprint_id}`;
    console.log('getTasksEffortsSummary');
    console.log(url);
    return this._httpCli.get(url);
  }
  
  getBurnDownChartData(sprint_id:string){
    let url=this.sApiEndPoint+`burndown-chart?sprint_id=${sprint_id}`;
    console.log('getBurnDownChartData');
    console.log(url);
    return this._httpCli.get(url);
  }

  getSprintWorkloadByUser(sprint_id:string){
    let url=this.sApiEndPoint+`sprint-workloadby-user?sprint_id=${sprint_id}`;
    console.log('getSprintWorkloadByUser');
    console.log(url);
    return this._httpCli.get(url);
  }

  getSprintTaskCountByUser(sprint_id:string){
    let url=this.sApiEndPoint+`sprint-task-count-user?sprint_id=${sprint_id}`;
    console.log('getSprintTaskCountByUser');
    console.log(url);
    return this._httpCli.get(url);
  }

  getSprintEstActsByIssueStatus(sprint_id:string){
    let url=this.sApiEndPoint+`sprint-issue-statuses-by-efforts?sprint_id=${sprint_id}`;
    console.log('getSprintEstActsByIssueStatus');
    console.log(url);
    return this._httpCli.get(url);
  }

}
