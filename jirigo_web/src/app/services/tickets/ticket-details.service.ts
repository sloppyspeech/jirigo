import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment  } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketDetailsService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"ticket-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private _httpCli: HttpClient) { }

  getTicketDetails(ticketId:string) {
    console.log('@@@@getTicketDetails :'+ticketId);
    // this.sApiEndPoint=this.sApiEndPoint+ticketId;
    console.log("getTicketDetails End point :"+this.sApiEndPoint+'tickets/'+ticketId);
    return this._httpCli.get<any>(this.sApiEndPoint+'tickets/'+ticketId)
      .toPromise()
      .then(res => { 
        console.log("In  TicketDetailsService:"+JSON.stringify(res));
        return res; 
      });
  }

  creTicket(inpData){
    this._httpCli.post(this.sApiEndPoint+'create_ticket/',JSON.stringify(inpData),this.sHttpOptions)
        .subscribe(res=>{
            console.log('Ticket Creation Response :'+res);
        });
  }
}
