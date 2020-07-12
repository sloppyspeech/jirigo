import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"vacation-management/"
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
  
  getAllVacationsForATimePeriod(inpData){
    let url = this.sApiEndPoint +`all-vacations/?start_date=${inpData['start_date']}&end_date=${inpData['end_date']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getUserVacationDetails(inpData){

  }

  getAllUserVacations(inpData){

  }

  checkVacationOverlap(inpData){
    let url = this.sApiEndPoint +`check-overlap?user_id=${inpData['user_id']}&input_date=${inpData['input_date']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  updateVacationForUser(inpData){
    let url=this.sApiEndPoint+'update-vacation-for-user';
    console.log("User Data For updateVacationForUser "+JSON.stringify(inpData));
    console.log("End point :"+url);
    return this._httpCli.put(url,inpData,this.sHttpOptions);
  }

  createVacationForUser(inpData){
    let url=this.sApiEndPoint+'create-vacation';
    console.log("User Data For createVacationForUser "+JSON.stringify(inpData));
    console.log("End point :"+url);
    return this._httpCli.post(url,inpData,this.sHttpOptions);
  }

}
