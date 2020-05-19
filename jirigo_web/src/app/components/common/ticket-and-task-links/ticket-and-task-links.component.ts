import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StaticDataService} from '../../../services/static-data.service';
import {TaskTicketLinkService} from '../../../services/task-ticket-links/task-ticket-link.service';

@Component({
  selector: 'app-ticket-and-task-links',
  templateUrl: './ticket-and-task-links.component.html',
  styleUrls: ['./ticket-and-task-links.component.css']
})
export class TicketAndTaskLinksComponent implements OnInit {
  @Input() showLinkTaskModal:boolean=true;
  @Input() currentItemNo:string='';
  @Input() currentItemSummary:string='';
  @Output('taskTicketLinksSelected') taskTicketLinksSelected = new EventEmitter;
  @Output('linkModalClosed') linkModalClosed = new EventEmitter;

  linkReferenceValues:any[]=[];
  filteredTaskTickets:any[]=[];
  selectedTaskTickets:any=[];
  relationShipType:string='';

  taskTicketLinks:any[]=[];
  tempMulti:any[]=[];
  
  constructor(private _serStaticData:StaticDataService,private _taskTicketLinkSer:TaskTicketLinkService) { }

  ngOnInit(): void {
    this.linkReferenceValues=[];
    this.tempMulti=[];
    this._serStaticData.getRefForTaskTicketLinks(localStorage.getItem('currentProjectId'))
        .subscribe(res=>{
          console.log(res)
          if(res['dbQryStatus'] == "Success"){
            res['dbQryResponse'].forEach(linkRef => {
              this.linkReferenceValues.push({'label':linkRef['ref_value'],'value':linkRef['ref_value']});
              this.tempMulti.push({'label':linkRef['ref_value'],'value':{'name':linkRef['ref_value'],'code':linkRef['ref_value']}});
            });
          }
          console.log(this.linkReferenceValues);
        });
  }

  createLinks(){
    let inpData:any={
                      'created_by':localStorage.getItem('loggedInUserId'),
                      'item_no':this.currentItemNo,
                      'relationship':this.relationShipType,
                      'related_items':this.selectedTaskTickets
                    };
    this.taskTicketLinksSelected.emit(this.taskTicketLinks);
    this.showLinkTaskModal=false;
    console.log(inpData);
    this._taskTicketLinkSer.createTasksTicketsLinks(inpData)
        .subscribe(res=>{
          console.log("---------------------");
          if (res['dbQryStatus']=="Success"){
            console.log(res);
          }
          else{
            console.log(res);
          }
          this.linkModalClosed.emit('true');
        });
  
}


  closeDialog(){
    this.showLinkTaskModal=false;
    this.linkModalClosed.emit('true');
  }

  searchTaskTickets(event){
    let queryRes:any[]=[];
    console.log(event);
    let query = event.query;
    this._taskTicketLinkSer.getTasksTicketsForLinkDropDown({'project_id':'4','search_term':query})
        .subscribe(res=>{
          if(res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(item => {
              //}
              queryRes.push({name:item['item_no']+' : ' + item['summary'],code:item['item_no']});
            });
          }
          this.filteredTaskTickets=queryRes;
          console.log(this.filteredTaskTickets)
        });
  }
}
