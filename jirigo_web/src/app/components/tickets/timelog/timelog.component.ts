import { Component, OnInit,Input } from '@angular/core';
import { TicketLogtimeService} from '../../../services/tickets/ticket-logtime.service';

@Component({
  selector: 'app-ticket-timelog',
  templateUrl: './timelog.component.html',
  styleUrls: ['./timelog.component.css']
})
export class TimelogComponent implements OnInit {
  @Input() currentTicketNo:string;
  listTimeLogEntries:any[]=[];

  constructor(private _serTicketTimeLog:TicketLogtimeService) { }

  ngOnInit(): void {
    console.log('DependsOnComponent');

    console.log(this.currentTicketNo);
    this._serTicketTimeLog.getTimeLog(this.currentTicketNo)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(item=>{
              this.listTimeLogEntries.push(item);
            });
          }
        });
  }

}
