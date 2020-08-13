import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"project-management/"
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


  createProject(inpData:any){
    console.log("@@@@@ createProject @@@@@@@");
    console.log(inpData)
    return  this._httpCli.post(this.sApiEndPoint+'create-project',inpData,this.sHttpOptions);
  }
  getAllProjects(){
    console.log("getAllProjects:");
    console.log("this.sApiEndPoint:"+this.sApiEndPoint+'projects');
    return this._httpCli.get(this.sApiEndPoint+'projects');
  }

  getAllProjectsForUser(userId){
    console.log("this.sApiEndPoint:"+this.sApiEndPoint+'projects/user-projects/'+userId);
    return this._httpCli.get(this.sApiEndPoint+'projects/user-projects/'+userId);
  }
  getProjectDetails(projectId){
    let url=`${this.sApiEndPoint}projects/project?project_id=${projectId}`
    console.log(url);
    return this._httpCli.get(url);
  }

}
