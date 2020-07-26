import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskEstimateService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"task-management"
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

  getTaskEstimates(taskNo:string){
    let url = `${this.sApiEndPoint}/task-estimates?task_no=${taskNo}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  createOrUpdateTaskEstimates(inpData){
    console.log(inpData);
    let url = `${this.sApiEndPoint}/task-estimates`;
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

}
