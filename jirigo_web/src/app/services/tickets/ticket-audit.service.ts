import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TicketAuditService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"ticket-management/audit/"
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

  getTicketAuditData(ticketNo:string){
    console.log("getAllTicketComments:"+ticketNo);
    console.log("this.sApiEndPoint+ticketNo :"+this.sApiEndPoint+ticketNo);
    return this._httpCli.get(this.sApiEndPoint+ticketNo);
  }
}
