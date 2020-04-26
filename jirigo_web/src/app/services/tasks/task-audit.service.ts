import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskAuditService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"task-management/audit/"
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

  getTaskAuditData(taskNo:string){
    console.log("@@@@getAllComments@@@@@")
    console.log("getAllTaskComments:"+taskNo);
    console.log("this.sApiEndPoint+taskNo :"+this.sApiEndPoint+taskNo);
    return this._httpCli.get(this.sApiEndPoint+taskNo);
  }
}
