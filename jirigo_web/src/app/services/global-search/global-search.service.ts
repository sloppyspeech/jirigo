import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"global-search"
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

  getTicketTasksByGlobalSearch(inpData){
    let url=this.sApiEndPoint+`?search_text=${inpData}`;
    console.log(url);
    return this._httpCli.get(url);
  }
}

