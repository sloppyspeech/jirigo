import { Component, OnInit,Input } from '@angular/core';
import { TaskTicketLinkService  } from '../../../../services/task-ticket-links/task-ticket-link.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-depends-on',
  templateUrl: './depends-on.component.html',
  styleUrls: ['./depends-on.component.css']
})
export class DependsOnComponent implements OnInit {
  @Input() currentTaskTicketNo:string;
  getTaskTicketLinkDependsOn$:Subscription;
  listDependsOn:any[]=[];

  constructor(private _serTaskTicketLink:TaskTicketLinkService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this._serNgxSpinner.show();
    console.log('DependsOnComponent');
    let inpData={
      'project_id':localStorage.getItem('currentProjectId'),
      'item_no':this.currentTaskTicketNo
    }
    console.log(inpData);
    this._serTaskTicketLink.getTaskTicketLinkDependsOn(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success" && res['dbQryResponse']){
            res['dbQryResponse'].forEach(item=>{
              this.listDependsOn.push(item);
            });
          }
          this._serNgxSpinner.hide();
        });

  }

  ngOnDestroy() {
    if (this.getTaskTicketLinkDependsOn$){
      this.getTaskTicketLinkDependsOn$.unsubscribe();
    }
  }

}
