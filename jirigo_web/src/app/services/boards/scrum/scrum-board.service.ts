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
    let url=this.sApiEndPoint + `scrum?sprint_id=${inpSprintId}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  getAllStatusesForScrumBoard(inpData){
    let url=this.sApiEndPoint + `scrum-statuses-for-project?project_id=${inpData['project_id']}`;
    console.log(url);
    return this._httpCli.get(url);
  }

  updateSprintStepsForScrumBoard(inpData){
    let url=this.sApiEndPoint + `update-sprint-steps-for-scrumboard`;
    console.log(url);
    console.log(inpData)
    return this._httpCli.put(url,inpData,this.sHttpOptions);
  }

}
