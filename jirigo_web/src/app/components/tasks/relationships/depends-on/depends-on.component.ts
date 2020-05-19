import { Component, OnInit,Input } from '@angular/core';
import { TaskTicketLinkService  } from '../../../../services/task-ticket-links/task-ticket-link.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-depends-on',
  templateUrl: './depends-on.component.html',
  styleUrls: ['./depends-on.component.css']
})
export class DependsOnComponent implements OnInit {
  @Input() currentTaskTicketNo:string;
  getTaskTicketLinkDependsOn$:Subscription;
  listDependsOn:any[]=[];

  constructor(private _serTaskTicketLink:TaskTicketLinkService) { }

  ngOnInit(): void {
    console.log('DependsOnComponent');
    let inpData={
      'project_id':localStorage.getItem('currentProjectId'),
      'item_no':this.currentTaskTicketNo
    }
    console.log(inpData);
    this._serTaskTicketLink.getTaskTicketLinkDependsOn(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(item=>{
              this.listDependsOn.push(item);
            });
          }
        });

  }

  ngOnDestroy() {
    if (this.getTaskTicketLinkDependsOn$){
      this.getTaskTicketLinkDependsOn$.unsubscribe();
    }
  }

}
