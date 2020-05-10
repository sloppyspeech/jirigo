import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment  } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {
  apiBaseUrl:string=environment.apiBaseUrl;
  apiEndPoint:string=this.apiBaseUrl+"ref-data-management"

  constructor(private _httpCli: HttpClient) { }

  getRefTicketMaster(project_id) {
    return this._httpCli.get<any>(this.apiEndPoint+"/all-ticket-refs/"+project_id)
      .toPromise()
      .then(res => { 
        console.log("In StaticDataService :"+JSON.stringify(res));
        return res["dbQryResponse"]; 
      });
  }

  getRefTaskMaster(project_id) {
    return this._httpCli.get<any>(this.apiEndPoint+"/all-task-refs/"+project_id)
      .toPromise()
      .then(res => { 
        console.log("In getRefTaskMaster :"+JSON.stringify(res));
        return res["dbQryResponse"]; 
      });
  }

  getRefSprintMaster(project_id){
    return this._httpCli.get<any>(this.apiEndPoint+"/all-sprint-refs/"+project_id);
  }
}
