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

  constructor(
    private _serTaskAudit: TaskAuditService,
    private _serNgxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getTaskAuditData();
  }
  getTaskAuditData(){
    console.log("=======getTaskAuditData=======");
    console.log("======="+this.parentForm.get('fctlTaskNo').value+"=======");
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
            this.allTaskAuditData=[];
          }
        });
  }

  toggleShowAudit(){
    this.showTaskAudit=!this.showTaskAudit;
  }

}
