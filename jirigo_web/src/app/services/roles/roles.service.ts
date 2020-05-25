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
    let url = this.sApiEndPoint +'all-roles-active-for-projects';
    console.log(url);
    return this._httpCli.get(url);
        
  }

}

export interface infRole {
  project_id:number,
  role_id: number;
  role_name?: string;
  created_by: number;
  modified_by?: number;
}
