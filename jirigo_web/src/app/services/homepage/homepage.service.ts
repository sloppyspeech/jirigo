import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"homepage/"
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

  getRecentProjActivities(inpData){
    let url=this.sApiEndPoint+`recent-proj-activities?project_id=${inpData['project_id']}&current_user_id=${inpData['current_user_id']}&num_rows=${inpData['num_rows']}`;
    console.log(url);
    return this._httpCli.get(url);
  }
}

