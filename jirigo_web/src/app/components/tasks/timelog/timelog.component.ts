import { Component, OnInit,Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskLogtimeService} from '../../../services/tasks/task-logtime.service';
import { GenericTableComponent} from '../../../shared/modules/generic-table/generic-table.component';
@Component({
  selector: 'app-timelog',
  templateUrl: './timelog.component.html',
  styleUrls: ['./timelog.component.css']
})
export class TimelogComponent implements OnInit {
  @Input() currentTaskNo:string;
  showTimelog:boolean=false;
  getTaskTicketLinkDependsOn$:Subscription;
  filteredTimeLogEntries:any[]=[];
  allTimeLogEntries:any[]=[];
  timelogFields:any[]=[
    {'header':'User','field':'time_spent_by','width':'13%','type':'string'},
    {'header':'Time Spent','field':'actual_time_spent','width':'6%','type':'hhmi'},
    {'header':'Activity','field':'activity','width':'10%','type':'string'},
    {'header':'Date','field':'actual_date','width':'8%','type':'date'},
    {'header':'Other Activity','field':'other_activity_comment','width':'20%','type':'string'},
    {'header':'Comment','field':'timelog_comment','width':'35%','type':'string'}
  ];
  constructor(private _serTaskTimeLog:TaskLogtimeService) { }

  ngOnInit(): void {
    console.log('ngOnInit Timelogging');
    this.getTimeLoggingData();
  }

  getTimeLoggingData(){
    this.showTimelog=false;
    this.allTimeLogEntries=[];
    console.log(this.currentTaskNo);
    this._serTaskTimeLog.getTimeLog(this.currentTaskNo)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(item=>{
              this.filteredTimeLogEntries.push(item);
            });
            this.allTimeLogEntries=this.filteredTimeLogEntries;
            this.showTimelog=true;
          }
        });
  }


}
