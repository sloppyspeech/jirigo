import { Component, OnInit,Input } from '@angular/core';
import { TaskTicketLinkService  } from '../../../../services/task-ticket-links/task-ticket-link.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-duplicated-by',
  templateUrl: './duplicated-by.component.html',
  styleUrls: ['./duplicated-by.component.css']
})
export class DuplicatedByComponent implements OnInit {
  @Input() currentTaskTicketNo:string;
  getTaskTicketLinkDependsOn$:Subscription;
  listDuplicatedBy:any[]=[];

  constructor(private _serTaskTicketLink:TaskTicketLinkService) { }

  ngOnInit(): void {
    console.log('RelatedToComponent');
    let inpData={
      'project_id':localStorage.getItem('currentProjectId'),
      'item_no':this.currentTaskTicketNo
    }
    console.log(inpData);
    this._serTaskTicketLink.getTaskTicketLinkDuplicatedBy(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success" && res['dbQryResponse']){
            res['dbQryResponse']?.forEach(item=>{
              this.listDuplicatedBy.push(item);
            });
          }
        });
  }

}
