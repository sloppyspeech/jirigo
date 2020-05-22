import { Component, OnInit,Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskLogtimeService} from '../../../services/tasks/task-logtime.service';

@Component({
  selector: 'app-timelog',
  templateUrl: './timelog.component.html',
  styleUrls: ['./timelog.component.css']
})
export class TimelogComponent implements OnInit {
  @Input() currentTaskNo:string;
  getTaskTicketLinkDependsOn$:Subscription;
  listTimeLogEntries:any[]=[];

  constructor(private _serTaskTimeLog:TaskLogtimeService) { }

  ngOnInit(): void {
    console.log('DependsOnComponent');

    console.log(this.currentTaskNo);
    this._serTaskTimeLog.getTimeLog(this.currentTaskNo)
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
