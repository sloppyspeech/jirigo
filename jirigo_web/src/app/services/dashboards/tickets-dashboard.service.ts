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

  getDashboardTicketGenericSummary(last_n_days:number){
    let url=this.sApiEndPoint+'summaries/generic?project_id='+localStorage.getItem('currentProjectId')+'&last_n_days='+last_n_days;
    console.log('@@@@getDashboardTicketSummary');
    console.log(url);
    return this._httpCli.get(url);
      
  }

  getDashboardTicketSummaryByIssueStatus(last_n_days:number){
    let url=this.sApiEndPoint+'summaries/issue_status?project_id='+localStorage.getItem('currentProjectId')+'&last_n_days='+last_n_days;
    console.log('@@@@getDashboardTicketSummaryByIssueStatus');
    console.log(url);
    return this._httpCli.get<any>(url).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );;
      
  
  }
  getDashboardTicketSummaryByIssueType(last_n_days:number){
    let url=this.sApiEndPoint+'summaries/issue_type?project_id='+localStorage.getItem('currentProjectId')+'&last_n_days='+last_n_days;
    console.log('@@@@getDashboardTicketSummaryByIssueStatus');
    console.log(url);
    return this._httpCli.get<any>(url).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getDashboardTicketsCreatedPerDayForNDays(last_n_days){
    let url=this.sApiEndPoint+'created-by-range?project_id='+localStorage.getItem('currentProjectId')+'&last_n_days='+last_n_days;
    console.log('@@@@getDashboardTicketCountForLastNDays');
    console.log("getDashboardTicketCountForLastNDays End point :"+url);
    return this._httpCli.get<any>(url).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getDashboardTicketStillOpenInLastNDays(last_n_days){
    let url=this.sApiEndPoint+'open-last-ndays?project_id='+localStorage.getItem('currentProjectId')+'&last_n_days='+last_n_days;
    console.log('@@@@getDashboardTicketStillOpenInLastNDays');
    console.log("getDashboardTicketStillOpenInLastNDays End point :"+url);
    return this._httpCli.get<any>(url).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getDashboardTicketOpenByModuleInLastNDays(last_n_days){
    let url=this.sApiEndPoint+'open-tickets-by-module-last-ndays?project_id='+localStorage.getItem('currentProjectId')+'&last_n_days='+last_n_days;
    console.log('@@@@getDashboardTicketOpenByModuleInLastNDays');
    console.log("getDashboardTicketOpenByModuleInLastNDays End point :"+url);
    return this._httpCli.get<any>(url);
  }

}
