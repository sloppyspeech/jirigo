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
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST,PATCH',
      "Access-Control-Allow-Headers":"Content-Type"
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

  getAllTickets() {
    console.log('@@@@getAllTickets :');
    console.log("getTicketDetails End point :"+this.sApiEndPoint+'tickets');
    return this._httpCli.get<any>(this.sApiEndPoint+'tickets')
      .toPromise()
      .then(res => { 
        console.log("In  Get All Tickets:"+JSON.stringify(res));
        return res; 
      });
  }

  creTicket(inpData){
    console.log("@@@@@ CreTicket @@@@@@@");
    console.log(inpData)
    return  this._httpCli.post(this.sApiEndPoint+'ticket',inpData,this.sHttpOptions);
  }

  updateTicket(inpData){
    console.log("***Inside Update ticket***");
    console.log(inpData);
    return this._httpCli.put(this.sApiEndPoint+'ticket',inpData,this.sHttpOptions);

  }
}
