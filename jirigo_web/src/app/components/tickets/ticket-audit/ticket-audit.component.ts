import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TicketAuditService } from '../../../services/tickets/ticket-audit.service';
import { NgxSpinnerService  }  from 'ngx-spinner';

@Component({
  selector: 'app-ticket-audit',
  templateUrl: './ticket-audit.component.html',
  styleUrls: ['./ticket-audit.component.css']
})
export class TicketAuditComponent implements OnInit {
  allTicketAuditData;
  showTicketAudit:boolean=true;
  auditLogFields:any[]=[
    {'header':'Time','field':'created_date','width':'8%','type':'hhmiss'},
    {'header':'User','field':'created_by','width':'10%','type':'string'},
    {'header':'Field','field':'display_column_name','width':'10%','type':'string'},
    {'header':'Old Value','field':'old_value','width':'15%','type':'string'},
    {'header':'New Value','field':'new_value','width':'15%','type':'string'}
    ];
  @Input()
  parentForm:FormGroup;

  constructor(
    private _serTicketAudit: TicketAuditService,
    private _serNgxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getTicketAuditData();
  }
  getTicketAuditData(){
    this._serNgxSpinner.show();
    console.log("=======getTicketAuditData=======");
    console.log("======="+this.parentForm.get('fctlTicketNo').value+"=======");
    this._serTicketAudit.getTicketAuditData(this.parentForm.get('fctlTicketNo').value)
        .subscribe(res=>{
          console.log("=========" + res['dbQryStatus'] + "=========");
          if (res['dbQryStatus'] == "Success") {
            console.log(res['dbQryResponse']);
            this.allTicketAuditData = res['dbQryResponse'];
            
            console.log("==================");
          }
          else{
            this.allTicketAuditData=[];
          }
          this._serNgxSpinner.hide();
        });
  }

  toggleShowAudit(){
    this.showTicketAudit=!this.showTicketAudit;
  }

}
