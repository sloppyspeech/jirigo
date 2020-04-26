import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskDetailsService {
  sApiBaseUrl: string = environment.apiBaseUrl;
  sApiEndPoint: string = this.sApiBaseUrl + "task-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST,PATCH',
      "Access-Control-Allow-Headers": "Content-Type"
    })
  };
  constructor(private _httpCli: HttpClient) { }

  getTaskDetails(taskNo: string) {
    console.log('@@@@getTaskDetails :' + taskNo);
    // this.sApiEndPoint=this.sApiEndPoint+taskNo;
    console.log("getTaskDetails End point :" + this.sApiEndPoint + 'tasks/' + taskNo);
    return this._httpCli.get<any>(this.sApiEndPoint + 'tasks/' + taskNo)
      .toPromise()
      .then(res => {
        console.log("In  TaskDetailsService:" + JSON.stringify(res));
        return res;
      });
  }

  getAllTasks() {
    console.log('@@@@getAllTasks :');
    console.log("getTaskDetails End point :" + this.sApiEndPoint + 'tasks');
    return this._httpCli.get<any>(this.sApiEndPoint + 'tasks')
      .toPromise()
      .then(res => {
        console.log("In  Get All Tasks:" + res);
        return res;
      });
  }

  creTask(inpData) {
    console.log("@@@@@ CreTask @@@@@@@");
    console.log(inpData)
    return this._httpCli.post(this.sApiEndPoint + 'task', inpData, this.sHttpOptions);
  }

  updateTask(inpData) {
    console.log("***Inside Update task***");
    console.log(inpData);
    return this._httpCli.put(this.sApiEndPoint + 'task', inpData, this.sHttpOptions);
  }

  cloneTask(inpData) {
    console.log("***Inside Clone task***");
    console.log(inpData);
    return this._httpCli.post(this.sApiEndPoint + 'clone-task', inpData, this.sHttpOptions);
  }



}
