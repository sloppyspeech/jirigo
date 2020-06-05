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
        console.log("In  TaskDetailsService:" + JSON.stringify(res,null,'\t'));
        return res;
      });
  }

  getAllTasks() {
    console.log('@@@@getAllTasks :');
    console.log("getTaskDetails End point :" + this.sApiEndPoint + 'all-tasks/'+localStorage.getItem('currentProjectId'));
    return this._httpCli.get<any>(this.sApiEndPoint + 'all-tasks/'+localStorage.getItem('currentProjectId'))
      .toPromise()
      .then(res => {
        console.log("In  Get All Tasks:" + res);
        return res;
      });
  }
  getAllTasksByCriterion(searchCriteria:{project_id:string,'assignee_id':string,created_by:string,modified_by:string}) {
    let qryParams="";
    qryParams="project_id="+searchCriteria.project_id+"&";
    qryParams=qryParams + "assignee_id="+searchCriteria.assignee_id+"&";
    qryParams=qryParams + "created_by="+searchCriteria.created_by+"&";
    qryParams=qryParams + "modified_by="+searchCriteria.modified_by;

    let url=this.sApiEndPoint + 'all-tasks-by-criterion?'+qryParams;
    console.log('@@@@getAllTasksByCriterion :');
    console.log(url);
    return this._httpCli.get<any>(url);

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

  updateTaskAssignee(inpData){
    console.log("***Inside updateTaskAssignee***");
    console.log(inpData);
    return this._httpCli.post(this.sApiEndPoint + 'update-assignee', inpData, this.sHttpOptions);
  }


}
