import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment  } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {
  apiBaseUrl:string=environment.apiBaseUrl;
  apiEndPoint:string=this.apiBaseUrl+"ref-data-management/all-ticket-refs"

  constructor(private _httpCli: HttpClient) { }

  getRefMaster() {
    return this._httpCli.get<any>(this.apiEndPoint)
      .toPromise()
      .then(res => { 
        console.log("In StaticDataService :"+JSON.stringify(res));
        return res["dbQryResponse"]; 
      });
  }
}
