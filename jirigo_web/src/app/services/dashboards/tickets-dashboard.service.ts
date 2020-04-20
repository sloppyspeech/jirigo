import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TicketsDashboardService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"dashboard-data/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }

  getDashboardTicketSummary(){
    console.log('@@@@getDashboardTicketSummary');
    console.log("getTicketDetails End point :"+this.sApiEndPoint+'summaries/');
    return this._httpCli.get<any>(this.sApiEndPoint+'summaries').pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );;
      
  }

}
