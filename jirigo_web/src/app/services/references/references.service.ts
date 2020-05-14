import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferencesService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sProjectsApiEndPoint:string=this.sApiBaseUrl+"project-management/"
  sReferenceApiEndPoint:string=this.sApiBaseUrl+"ref-data-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };
  constructor(private _httpCli:HttpClient) { }

  getAllProjects(){
    console.log("@@@@getAllProjects@@@@@")
    console.log("getAllProjects:");
    console.log("this.sProjectsApiEndPoint:"+this.sProjectsApiEndPoint+'projects');
    return this._httpCli.get(this.sProjectsApiEndPoint+'projects');
  }


  getAllRefsForShowAndEdit(){
    return this._httpCli.get<any>(this.sReferenceApiEndPoint+"all-refs-for-show-and-edit");
  }

  createReference(inpData){
    return this._httpCli.post(this.sReferenceApiEndPoint+'create-ref', inpData, this.sHttpOptions);
  }

  editReference(inpData){
    return this._httpCli.post(this.sReferenceApiEndPoint+'edit-ref', inpData, this.sHttpOptions);
  }

}
