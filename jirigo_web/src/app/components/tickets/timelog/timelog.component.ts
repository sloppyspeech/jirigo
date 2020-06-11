import { Component, OnInit,Input } from '@angular/core';
import { TicketLogtimeService} from '../../../services/tickets/ticket-logtime.service';
import { NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-ticket-timelog',
  templateUrl: './timelog.component.html',
  styleUrls: ['./timelog.component.css']
})
export class TimelogComponent implements OnInit {
  @Input() currentTicketNo:string;
  listTimeLogEntries:any[]=[];

  constructor(private _serTicketTimeLog:TicketLogtimeService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    console.log('ngOnInit ticket timelog');
    this.getTimeLoggingData();
  }
  getTimeLoggingData(){
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
              this._serNgxSpinner.hide();
        });
  }
}
