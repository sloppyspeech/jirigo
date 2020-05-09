import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../../environments/environment';
import { map  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ScrumBoardService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"boards-management/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }


  getAllTasksOfASprintForScrumBoard(inpSprintId:string){
    console.log("getAllTasksOfASprintForScrumBoard End point :" + this.sApiEndPoint + 'scrum/'+inpSprintId);
    return this._httpCli.get<any>(this.sApiEndPoint + 'scrum/'+inpSprintId);
  }

}
