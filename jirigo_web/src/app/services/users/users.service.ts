import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"user-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }

  getUserNamesForDropDownSearch(userName:string){
    console.log('@@@@getUserNamesForDropDownSearch :'+userName);
    // this.sApiEndPoint=this.sApiEndPoint+ticketId;
    console.log("getTicketDetails End point :"+this.sApiEndPoint+'user-names/'+userName);
    return this._httpCli.get<any>(this.sApiEndPoint+'user-names/'+userName).pipe(
      map((response) => {
        console.log(response);
        return response['dbQryResponse'];
      })
    );;
      
  }
}
