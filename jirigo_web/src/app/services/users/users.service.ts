import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map,take  } from 'rxjs/operators';
import { BehaviorSubject,Observable ,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
   isLoggedIn = new BehaviorSubject<boolean>(false);
   loggedInUserProps=new BehaviorSubject<any>({});

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

  getAllActiveUsers(){
    console.log('@@@@getAllActiveUsers :');
    console.log("getTicketDetails End point :"+this.sApiEndPoint+'all-users');
    return this._httpCli.get<any>(this.sApiEndPoint+'all-users');
      
  }

  login(inpData){
    this.isLoggedIn.next(false);
    console.log("User Data For login "+JSON.stringify(inpData));
    console.log("login End point :"+this.sApiEndPoint+'login');
    return this._httpCli.post(this.sApiEndPoint+'login',inpData,this.sHttpOptions);
  }

  registerUser(inpData){
    console.log("User Data For Registration "+JSON.stringify(inpData));
    console.log("registerUser End point :"+this.sApiEndPoint+'register-user/');
    return this._httpCli.post(this.sApiEndPoint+'register-user',inpData,this.sHttpOptions);
  }

  createUser(inpData){
    console.log("User Data For Create User "+JSON.stringify(inpData));
    console.log("registerUser End point :"+this.sApiEndPoint+'create-user/');
    return this._httpCli.post(this.sApiEndPoint+'create-user',inpData,this.sHttpOptions);
  }

  authorizeCurrentRouteForUser(inpData){
    console.log("User Data For login "+JSON.stringify(inpData));
    console.log("login End point :"+this.sApiEndPoint+'authorization/auth-route-for-user');
    return this._httpCli.post(this.sApiEndPoint+'authorization/auth-route-for-user',inpData,this.sHttpOptions);
  }

  activateInactivateUser(inpData){
    let url=this.sApiEndPoint+'user-activate-inactivate';
    console.log("User Data For activateInactivateUser "+JSON.stringify(inpData));
    console.log("login End point :"+url);
    return this._httpCli.put(url,inpData,this.sHttpOptions);
  }

  setPassword(inpData){
    let url=this.sApiEndPoint+'set-password';
    console.log("login End point :"+url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }
}
