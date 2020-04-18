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
    console.log("=======getTicketAuditData=======");
    console.log("======="+this.parentForm.get('fctlTicketNo').value+"=======");
    this._serTicketAudit.getTicketAuditData(this.parentForm.get('fctlTicketNo').value)
        .subscribe(res=>{
          console.log("=========" + res['dbQryStatus'] + "=========");
          if (res['dbQryStatus'] == "Success") {
            console.log(res['dbQryResponse']);
            this.allTicketAuditData = res['dbQryResponse'];
            this._serNgxSpinner.hide();
            console.log("==================");
          }
          else{
            this.allTicketAuditData=[];
          }
        });
  }

  toggleShowAudit(){
    this.showTicketAudit=!this.showTicketAudit;
  }

}
