import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TicketsDashboardService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"ticket-dashboard/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }

  getDashboardTicketGenericSummary(){
    console.log('@@@@getDashboardTicketSummary');
    console.log("getTicketDetails End point :"+this.sApiEndPoint+'summaries/generic/'+localStorage.getItem('currentProjectId'));
    return this._httpCli.get<any>(this.sApiEndPoint+'summaries/generic/'+localStorage.getItem('currentProjectId')).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );;
      
  }

  getDashboardTicketSummaryByIssueStatus(){
    console.log('@@@@getDashboardTicketSummaryByIssueStatus');
    console.log("getDashboardTicketSummaryByIssueStatus End point :"+this.sApiEndPoint+'summaries/issue_type/'+localStorage.getItem('currentProjectId'));
    return this._httpCli.get<any>(this.sApiEndPoint+'summaries/issue_status/'+localStorage.getItem('currentProjectId')).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );;
      
  
  }
  getDashboardTicketSummaryByIssueType(){
    console.log('@@@@getDashboardTicketSummaryByIssueStatus');
    console.log("getDashboardTicketSummaryByIssueStatus End point :"+this.sApiEndPoint+'summaries/issue_type/'+localStorage.getItem('currentProjectId'));
    return this._httpCli.get<any>(this.sApiEndPoint+'summaries/issue_type/'+localStorage.getItem('currentProjectId')).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

}
