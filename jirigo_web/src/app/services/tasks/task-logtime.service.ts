import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskLogtimeService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"timelogger/tasks/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(
    private _httpCli:HttpClient
  ) { }

  getTimeLog(taskNo:string){
    console.log("@@@@getAllComments@@@@@")
    console.log("getAllTaskComments:"+taskNo);
    let url=this.sApiEndPoint+"task/timelog/"+taskNo;
    return this._httpCli.get(url);
  }
  createTimeLog(inpData:ITimeLogData){
    console.log('createTimeLog');
    console.log(inpData);
    let url=this.sApiEndPoint+"task/log-time";
    return this._httpCli.post(url, inpData, this.sHttpOptions);
  }
}

export interface ITimeLogData {
  task_no:string;
  activity:string;
  actual_time_spent:number;
  other_activity_comment:string;
  timelog_comment:string;
  time_spent_by:string;
  actual_date:Date;
}
