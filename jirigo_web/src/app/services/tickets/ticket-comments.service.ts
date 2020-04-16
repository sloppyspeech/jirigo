import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TicketCommentsService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"ticket-management/comments/"
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

  createComment(inpData){
    console.log("@@@@@ createComment @@@@@@@");
    console.log(inpData)
    return  this._httpCli.post(this.sApiEndPoint+'comment',inpData,this.sHttpOptions);
  }

  getAllTicketComments(ticketNo:string){
    console.log("@@@@getAllComments@@@@@")
    console.log("getAllTicketComments:"+ticketNo);
    return this._httpCli.get(this.sApiEndPoint+ticketNo);
  }
}
