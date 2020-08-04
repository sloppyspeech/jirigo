import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  sApiBaseUrl: string = environment.apiBaseUrl;
  sApiEndPoint: string = this.sApiBaseUrl + "menu-management/";
  private sHttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS,DELETE,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    }),
    body:{}
  };
  constructor(private _httpCli: HttpClient) { }

  getMenusForProjectRole(inpData){
    let url = this.sApiEndPoint +'all-menuitems-by-role-project'+`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }
  
  getAllMenusForProject(){
    let url = this.sApiEndPoint +'all-menus-for-project';
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllUnassignedMenusForProjectRole(inpData){
    let url = this.sApiEndPoint +'all-unassigned-menuitems-by-role-project'+`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllAssignedMenusForProjectRole(inpData){
    let url = this.sApiEndPoint +'all-assigned-menuitems-by-role-project'+`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  addMenusToRole(inpData){
    let url = this.sApiEndPoint +'add-menus-to-role';
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

  addNewMenu(inpData){
    let url = this.sApiEndPoint +'add-menu';
    console.log(url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

  getAllValidUserRoutesForMenu(inpData){
    let url = this.sApiEndPoint +'valid-routes-for-user'+`?project_id=${inpData['project_id']}&role_id=${inpData['role_id']}&user_id=${inpData['user_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }
}
