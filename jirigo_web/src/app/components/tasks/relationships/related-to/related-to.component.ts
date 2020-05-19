import { Component, OnInit, Input } from '@angular/core';
import { TaskTicketLinkService  } from '../../../../services/task-ticket-links/task-ticket-link.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-related-to',
  templateUrl: './related-to.component.html',
  styleUrls: ['./related-to.component.css']
})
export class RelatedToComponent implements OnInit {
  @Input() currentTaskTicketNo:string;
  getTaskTicketLinkDependsOn$:Subscription;
  listRelatedTo:any[]=[];

  constructor(private _serTaskTicketLink:TaskTicketLinkService) { }

  ngOnInit(): void {
    console.log('RelatedToComponent');
    let inpData={
      'project_id':localStorage.getItem('currentProjectId'),
      'item_no':this.currentTaskTicketNo
    }
    console.log(inpData);
    this._serTaskTicketLink.getTaskTicketLinkRelatedTo(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(item=>{
              this.listRelatedTo.push(item);
            });
          }
        });

  }

}
