import { Component, OnInit,Input } from '@angular/core';
import { TicketLogtimeService} from '../../../services/tickets/ticket-logtime.service';
import { NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-ticket-timelog',
  templateUrl: './timelog.component.html',
  styleUrls: ['./timelog.component.css']
})
export class TimelogComponent implements OnInit {
  showTimeLog:boolean=false;
  @Input() currentTicketNo:string;
  listTimeLogEntries:any[]=[];
  timelogFields:any[]=[
    {'header':'User','field':'time_spent_by','width':'13%','type':'string'},
    {'header':'Time Spent','field':'time_spent','width':'6%','type':'hhmi'},
    {'header':'Activity','field':'activity','width':'10%','type':'string'},
    {'header':'Date','field':'actual_date','width':'8%','type':'date'},
    {'header':'Other Activity','field':'other_activity_comment','width':'20%','type':'string'},
    {'header':'Comment','field':'timelog_comment','width':'35%','type':'string'}
  ];
  constructor(private _serTicketTimeLog:TicketLogtimeService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    console.log('ngOnInit ticket timelog');
    this.getTimeLoggingData();
  }
  getTimeLoggingData(){
    this.showTimeLog=false;
    this._serNgxSpinner.show();
    console.log(this.currentTicketNo);
    this._serTicketTimeLog.getTimeLog(this.currentTicketNo)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(item=>{
              this.listTimeLogEntries.push(item);
            });
          }
              this.showTimeLog=true;
              this._serNgxSpinner.hide();
        });
  }
}
