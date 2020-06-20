import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TaskAuditService } from '../../../services/tasks/task-audit.service';
import { NgxSpinnerService  }  from 'ngx-spinner';

@Component({
  selector: 'app-audit-task',
  templateUrl: './audit-task.component.html',
  styleUrls: ['./audit-task.component.css']
})
export class AuditTaskComponent implements OnInit {
  allTaskAuditData;
  showTaskAudit:boolean=true;

  @Input()
  parentForm:FormGroup;

  auditLogFields:any[]=[
    {'header':'Time','field':'created_date','width':'8%','type':'hhmiss'},
    {'header':'User','field':'created_by','width':'10%','type':'string'},
    {'header':'Field','field':'display_column_name','width':'10%','type':'string'},
    {'header':'Old Value','field':'old_value','width':'15%','type':'string'},
    {'header':'New Value','field':'new_value','width':'15%','type':'string'}
    ];

  constructor(
    private _serTaskAudit: TaskAuditService,
    private _serNgxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getTaskAuditData();
  }
  getTaskAuditData(){
    this._serNgxSpinner.show();
    this._serTaskAudit.getTaskAuditData(this.parentForm.get('fctlTaskNo').value)
        .subscribe(res=>{
          console.log("======getTaskAuditData===" + res['dbQryStatus'] + "=========");
          if (res['dbQryStatus'] == "Success") {
            console.log(res['dbQryResponse']);
            this.allTaskAuditData = res['dbQryResponse'];
            this._serNgxSpinner.hide();
            console.log("==================");
          }
          else{
            this._serNgxSpinner.hide();
            this.allTaskAuditData=[];
          }
        });
  }

  toggleShowAudit(){
    this.showTaskAudit=!this.showTaskAudit;
  }

}
