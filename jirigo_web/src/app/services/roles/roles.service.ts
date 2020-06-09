import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  sApiBaseUrl: string = environment.apiBaseUrl;
  sApiEndPoint: string = this.sApiBaseUrl + "role-management/";
  private sHttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS,DELETE,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    }),
    body:{}
  };

  constructor(private _httpCli: HttpClient) {}

  getActiveRoles() {
    let url = this.sApiEndPoint +'all-active';
    console.log(url);
    return this._httpCli.get(url);
  }

  updateRole(inpData){
    let url = this.sApiEndPoint +'update-role';
    console.log(url);
    return this._httpCli.put(url,inpData,this.sHttpOptions);
  }

  addRole(inpData){
    let url = this.sApiEndPoint +'add-role';
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

  getRolesActiveForAllProjects(){
    let url = this.sApiEndPoint +'roles-active-for-all-projects';
    console.log(url);
    return this._httpCli.get(url);
  }

  addRoleToProject(inpData){
    let url = this.sApiEndPoint +'project-role';
    console.log(url);
    return this._httpCli.post(url, inpData, this.sHttpOptions);
  }

  removeRoleFromProject(inpData){
    let url = this.sApiEndPoint +'project-role';
    console.log(url);
    this.sHttpOptions.body ={
      'role_id':inpData['role_id'],
      'project_id':inpData['project_id']
    };
    return this._httpCli.delete(url, this.sHttpOptions);
  }

  assignWorkflowToRole(inpData){
    let url = this.sApiEndPoint +'assign-workflow-to-role';
    console.log(url);
    return this._httpCli.post(url, inpData, this.sHttpOptions);
  }

  getRolesForUserAssignment(inpData){
    let url = this.sApiEndPoint +'roles-assignable-for-user-by-project'+`?project_id=${inpData['project_id']}&user_id=${inpData['user_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  assignRolesToUser(inpData){
    let url = this.sApiEndPoint +'assign-roles-to-user';
    console.log(url);
    return this._httpCli.post(url, inpData, this.sHttpOptions);
  }
}

export interface infRole {
  project_id:number,
  role_id: number;
  role_name?: string;
  created_by: number;
  modified_by?: number;
}
