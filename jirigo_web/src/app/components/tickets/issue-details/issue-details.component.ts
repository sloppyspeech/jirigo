import { Component, OnInit,Input } from '@angular/core';
import { FormGroup  }  from '@angular/forms';
import { StaticDataService  } from '../../../services/static-data.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {
  @Input() parentForm:FormGroup;
  ticketEnvRef:[any];
  ticketIssueStatusesRef:[any];
  ticketPrioritiesRef:[any];
  ticketSeveritiesRef:[any];
  ticketIssueTypesRef:[any];

  constructor(private _staticRefData:StaticDataService,
    private _ngxSpinner:NgxSpinnerService) {
      console.log("Constructor for New Child Issue Details Component");
      this._staticRefData.getRefMaster()
        .then(res=>{
                    console.log(res);
                    this.ticketEnvRef=res[0].Environments;
                    this.ticketIssueStatusesRef=res[1].IssueStatuses;
                    this.ticketIssueTypesRef=res[2].IssueTypes;
                    this.ticketPrioritiesRef=res[3].Priorities;
                    this.ticketSeveritiesRef=res[4].Severities;
                    console.log("here:"+JSON.stringify(this.ticketEnvRef));
                    console.log("ticketIssueStatusesRef:"+JSON.stringify(this.ticketIssueStatusesRef));
                    console.log("ticketPrioritiesRef:"+JSON.stringify(this.ticketPrioritiesRef));
                    console.log("ticketSeverityRef:"+JSON.stringify(this.ticketSeveritiesRef));
                    console.log("ticketIssueTypesRef:"+JSON.stringify(this.ticketIssueTypesRef));

                   }
             );
     }

  ngOnInit(): void {

              this._ngxSpinner.show();
              console.log("Calling the New Ref Master");
              this._staticRefData.getRefMaster()
                .then(res=>{
                            console.log(res);
                            this.ticketEnvRef=res[0].Environments;
                            this.ticketIssueStatusesRef=res[1].IssueStatuses;
                            this.ticketIssueTypesRef=res[2].IssueTypes;
                            this.ticketPrioritiesRef=res[3].Priorities;
                            this.ticketSeveritiesRef=res[4].Severities;
                            console.log("here:"+JSON.stringify(this.ticketEnvRef));
                            console.log("ticketIssueStatusesRef:"+JSON.stringify(this.ticketIssueStatusesRef));
                            console.log("ticketPrioritiesRef:"+JSON.stringify(this.ticketPrioritiesRef));
                            console.log("ticketSeverityRef:"+JSON.stringify(this.ticketSeveritiesRef));
                            console.log("ticketIssueTypesRef:"+JSON.stringify(this.ticketIssueTypesRef));
                            setTimeout(()=>{
                              this._ngxSpinner.hide();
                            },1000)
                           }
                     );
  }

  setEnvironment1(e){
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e.target.value);
    // console.log(envSelected);
    // this.createTicketFB.controls.fctlIssueType.setValue(envSelected);

  }

  setEnvironment(e,f){
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e);
    // console.log(envSelected);
    // this.createTicketFB.controls.fctlIssueType.setValue(envSelected);

  }
  setIssueType(e,issueTypeSelected){
    // alert("Alert Called");
    console.log("setIssueType Called");
    console.log(issueTypeSelected);
    this.parentForm.get('fctlIssueType').setValue(issueTypeSelected);
    this.parentForm.controls.fctlIssueType.setValue(issueTypeSelected);
    // this.issueTypeO.emit(issueTypeSelected);
  }

  markCellToEdit(e,formControl){
    console.log(e);
    console.log(formControl);
    this.parentForm.get(formControl).enable();
  }

  showSpinner(){
    console.log('Show Spinner Called');
    // this._ngxSpinner.show();
    // setTimeout(()=>{
    //   this._ngxSpinner.hide();
    // },3000)

  }
}
