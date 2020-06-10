import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataExtractsService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"data-extracts/"
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

  getAllTicketsByDateRange(inpData){
    let url = this.sApiEndPoint +'tickets-by-daterange'+`?start_date=${inpData['start_date']}&end_date=${inpData['end_date']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllTasksByDateRange(inpData){
    let url = this.sApiEndPoint +'tasks-by-daterange'+`?start_date=${inpData['start_date']}&end_date=${inpData['end_date']}`;
    console.log(url);
    return this._httpCli.get(url);
  }
}
