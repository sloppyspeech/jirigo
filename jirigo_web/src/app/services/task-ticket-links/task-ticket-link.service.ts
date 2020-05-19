import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { environment  } from '../../../environments/environment';
import { map,take  } from 'rxjs/operators';
import { BehaviorSubject,Observable ,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskTicketLinkService {
  sApiBaseUrl:string=environment.apiBaseUrl;
  sApiEndPoint:string=this.sApiBaseUrl+"link-tasks-tickets/"
  private sHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET,PUT,OPTIONS,DELETE,POST',
      "Access-Control-Allow-Headers":"Content-Type"
    })
  };

  constructor(private _httpCli:HttpClient) { }

  getTasksTicketsForLinkDropDown(inpData:{project_id:string,search_term:string}){
    console.log('@@@@getTasksTicketsForLinkDropDown :');
    let url=this.sApiEndPoint+'search?project_id='+inpData['project_id']+'&search_term='+inpData['search_term'];
    console.log(url);
    return this._httpCli.get(url);
  }

  createTasksTicketsLinks(inpData:{
                                  'created_by': string,
                                  'item_no':string,
                                  'relationship':string,
                                  'related_items':any[]
                                  }
                          ){
    console.log('@@@@createTasksTicketsLinks :');
    let url=this.sApiEndPoint+'create-task-ticket-links';
    return this._httpCli.post(url, inpData, this.sHttpOptions);
  }

  getTaskTicketLinkDependsOn(inpData:{project_id:string,item_no:string}){
    console.log('@@@@getTasksTicketsForLinkDropDown :');
    let url=this.sApiEndPoint+'task-ticket/depends-on?project_id='+inpData['project_id']+'&item_no='+inpData['item_no'];
    console.log(url);
    return this._httpCli.get(url);
  }

  getTaskTicketLinkRelatedTo(inpData:{project_id:string,item_no:string}){
    console.log('@@@@getTasksTicketsForLinkDropDown :');
    let url=this.sApiEndPoint+'task-ticket/related-to?project_id='+inpData['project_id']+'&item_no='+inpData['item_no'];
    console.log(url);
    return this._httpCli.get(url);
  }

  getTaskTicketLinkDuplicatedBy(inpData:{project_id:string,item_no:string}){
    console.log('@@@@getTasksTicketsForLinkDropDown :');
    let url=this.sApiEndPoint+'task-ticket/duplicated-by?project_id='+inpData['project_id']+'&item_no='+inpData['item_no'];
    console.log(url);
    return this._httpCli.get(url);
  }


}

