import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, take } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjectWorkflowsService {
  sApiBaseUrl: string = environment.apiBaseUrl;
  sApiEndPoint: string = this.sApiBaseUrl + "workflows-management/";
  private sHttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS,DELETE,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    }),
  };

  constructor(private _httpCli: HttpClient) {}

  createProjectWorkflow(inpWorkflowData: infWorkflow) {
    let url = this.sApiEndPoint + "create-project-workflow";
    console.log(url);
    return this._httpCli.post(url, inpWorkflowData, this.sHttpOptions);
  }
  
  updateProjectWorkflow(inpWorkflowData:any) {
    let url = this.sApiEndPoint + "update-project-workflow";
    console.log(url);
    return this._httpCli.put(url, inpWorkflowData, this.sHttpOptions);
  }
  
  getNextAllowedStepsForProjectRoleCurrStatus(inpData){
    let url=this.sApiEndPoint+'next-steps-allowed';
    let params=`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}&current_status=${inpData['current_status']}`;
    url=url+params;
    console.log(url)
    return this._httpCli.get(url);

  }

  getAllStatusesForWorkflows(inpData){
    let url=this.sApiEndPoint+'all-statuses';
    let params=`?project_id=${inpData['project_id']}&ref_category=${inpData['ref_category']}`;
    url=url+params;
    console.log(url)
    return this._httpCli.get(url);
  }

  getUnAllocatedWorkflowsOfProjects(inpData){
    let url=this.sApiEndPoint+'not-allocated-to-role';
    let params=`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}`;
    url=url+params;
    console.log(url)
    return this._httpCli.get(url);
  }

  getProjectRoleWorkflowListForUpdate(){
    let url=this.sApiEndPoint+'projects-roles-workflows';
    url=url;
    console.log(url)
    return this._httpCli.get(url);
  }

  getWorkflowDetailsForUpdate(inpData){
    let url=this.sApiEndPoint+'workflow-details-for-update';
    let params=`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}&workflow_id=${inpData['workflow_id']}`;
    url=url+params;
    console.log(url)
    return this._httpCli.get(url);
  }

}

export interface infWorkflow {
  workflow_name: string;
  project_id: number;
  next_allowed_statuses: any;
  step_full_details: any;
  workflow_type?: string;
  created_by: number;
  modified_by?: number;
}
