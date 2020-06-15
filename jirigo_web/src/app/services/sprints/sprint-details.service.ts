import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SprintDetailsService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"sprint-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }

  createSprintWithTasks(inpData){
    console.log('--------createSprintWithTasks----------');
    console.log(inpData);
    return this._httpCli.post(this.sApiEndPoint+'create-sprint',inpData,this.sHttpOptions);
  }

  getAllNotClosedTasksByProjForSprint(inpProjName:string) {
    console.log("getAllNotClosedTasksByProjForSprint End point :" + this.sApiEndPoint + 'tasks-not-closed/'+inpProjName);
    return this._httpCli.get<any>(this.sApiEndPoint + 'tasks-not-closed/'+inpProjName);

  }

  getAllSprintsForProject(inpProjName:string){
    console.log("getAllSprintsForProject End point :" + this.sApiEndPoint + 'sprints-for-project/'+inpProjName);
    return this._httpCli.get<any>(this.sApiEndPoint + 'sprints-for-project/'+inpProjName);
  }

  getAllTasksForASprint(inpSprintId:string){
    console.log("getAllTasksForASprint End point :" + this.sApiEndPoint + 'tasks-for-sprint/'+inpSprintId);
    return this._httpCli.get<any>(this.sApiEndPoint + 'tasks-for-sprint/'+inpSprintId);
  }

  updateSprint(inpData:any){
    console.log("----------Start updateSprint------------");
    console.log(inpData);
    return this._httpCli.put(this.sApiEndPoint+'sprint-details',inpData,this.sHttpOptions);
  }

  updateSprintTasks(inpData:any){
    console.log("----------Start updateSprintTasks------------");
    console.log(inpData);
    return this._httpCli.put(this.sApiEndPoint+'sprint-tasks',inpData,this.sHttpOptions);
  }
  
  

}
