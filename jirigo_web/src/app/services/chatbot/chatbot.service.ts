import { ProjectsService } from './../projects/projects.service';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  projDetails:any;
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"chatbot-action"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };
  constructor(
    private _httpCli:HttpClient,
    private _serProjects:ProjectsService
  ) { }

  getProjectDetails(){
    this._serProjects.getProjectDetails(localStorage.getItem('currentProjectId'))
        .subscribe(res=>{
              if(res['dbQryResponse'] && res['dbQryStatus']== "Success"){
                this.projDetails=res['dbQryResponse'][0];
                console.log(this.projDetails);
              }
        }); 
  }
  getQueryResponse(query:string){
    let url=this.sApiEndPoint+`?query=${query}&proj_abbr=${this.projDetails['project_abbr']}`;
    console.log(url);
    return this._httpCli.get(url);
  }
}
