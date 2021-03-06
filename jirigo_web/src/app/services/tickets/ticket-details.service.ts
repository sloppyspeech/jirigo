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


  getAllTickets(projectId) {
    console.log('@@@@getAllTickets :');
    console.log("getTicketDetails End point :" + this.sApiEndPoint + 'proj-all-tickets/'+projectId);
    return this._httpCli.get<any>(this.sApiEndPoint + 'proj-all-tickets/'+projectId)
      .toPromise()
      .then(res => {
        console.log("In  Get All Tickets:" + res);
        return res;
      });
  }

  getAllTicketsByCriterion(searchCriteria:{project_id:string,'assignee_id':string,created_by:string,modified_by:string}) {
    let qryParams="";
    qryParams="project_id="+searchCriteria.project_id+"&";
    qryParams=qryParams + "assignee_id="+searchCriteria.assignee_id+"&";
    qryParams=qryParams + "created_by="+searchCriteria.created_by+"&";
    qryParams=qryParams + "modified_by="+searchCriteria.modified_by;

    let url=this.sApiEndPoint + 'all-tickets-by-criterion?'+qryParams;
    console.log('@@@@getAllTicketsByCriterion :');
    console.log(url);
    return this._httpCli.get<any>(url);

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


  updateTicketAssignee(inpData){
    console.log("***Inside updateTicketAssignee***");
    console.log(inpData);
    return this._httpCli.post(this.sApiEndPoint + 'update-assignee', inpData, this.sHttpOptions);
  }


}
