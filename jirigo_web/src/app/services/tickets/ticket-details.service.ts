import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketDetailsService {
  sApiBaseUrl: string = environment.apiBaseUrl;
  sApiEndPoint: string = this.sApiBaseUrl + "ticket-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS,DELETE,POST,PATCH',
      "Access-Control-Allow-Headers": "Content-Type"
    })
  };
  constructor(private _httpCli: HttpClient) { }

  getTicketDetails(ticketNo: string) {
    console.log('@@@@getTicketDetails :' + ticketNo);
    // this.sApiEndPoint=this.sApiEndPoint+ticketNo;
    console.log("getTicketDetails End point :" + this.sApiEndPoint + 'tickets/' + ticketNo);
    return this._httpCli.get<any>(this.sApiEndPoint + 'tickets/' + ticketNo)
      .toPromise()
      .then(res => {
        console.log("In  TicketDetailsService:" + JSON.stringify(res));
        return res;
      });
  }

  getAllTickets() {
    console.log('@@@@getAllTickets :');
    console.log("getTicketDetails End point :" + this.sApiEndPoint + 'tickets');
    return this._httpCli.get<any>(this.sApiEndPoint + 'tickets')
      .toPromise()
      .then(res => {
        console.log("In  Get All Tickets:" + res);
        return res;
      });
  }


  creTicket(inpData) {
    console.log("@@@@@ CreTicket @@@@@@@");
    console.log(inpData)
    return this._httpCli.post(this.sApiEndPoint + 'ticket', inpData, this.sHttpOptions);
  }

  updateTicket(inpData) {
    console.log("***Inside Update ticket***");
    console.log(inpData);
    return this._httpCli.put(this.sApiEndPoint + 'ticket', inpData, this.sHttpOptions);
  }

  cloneTicket(inpData) {
    console.log("***Inside Clone ticket***");
    console.log(inpData);
    return this._httpCli.post(this.sApiEndPoint + 'clone-ticket', inpData, this.sHttpOptions);
  }
}
