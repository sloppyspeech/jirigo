import { Component, OnInit,Input } from '@angular/core';
import { FormGroup  }  from '@angular/forms';
import { StaticDataService  } from '../../../services/static-data.service';
import { TicketDetailsService  } from '../../../services/tickets/ticket-details.service';
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
  isLoaded:boolean=false;
  ticket_id:string='NA';
  ticket_data:any;

  constructor(private _staticRefData:StaticDataService,
              private _serNgxSpinner:NgxSpinnerService,
              private _serTicketDetails:TicketDetailsService) {

      console.log("Constructor for New Child Issue Details Component");

     }

  ngOnInit(): void {

      // New Entry
    console.log("NgOnInit Issue Details Component");
    this.isLoaded = false;

    this._serNgxSpinner.show();
    try{
      this.ticket_id=this.parentForm.get('fctlTicket_id').value;
    }
    catch(e){
      console.log('@@@@@@@@@@@@@');
      console.log(e);
    }

    this._staticRefData.getRefMaster()
      .then(res => {
        console.log(res);
        this.ticketEnvRef = res[0].Environments;
        this.ticketIssueStatusesRef = res[1].IssueStatuses;
        this.ticketIssueTypesRef = res[2].IssueTypes;
        this.ticketPrioritiesRef = res[3].Priorities;
        this.ticketSeveritiesRef = res[4].Severities;
        
        console.log("here:" + JSON.stringify(this.ticketEnvRef));
        console.log("ticketIssueStatusesRef:" + JSON.stringify(this.ticketIssueStatusesRef));
        console.log("ticketPrioritiesRef:" + JSON.stringify(this.ticketPrioritiesRef));
        console.log("ticketSeverityRef:" + JSON.stringify(this.ticketSeveritiesRef));
        console.log("ticketIssueTypesRef:" + JSON.stringify(this.ticketIssueTypesRef));
        console.log('Activated Route check');
        // console.log(this._activatedRoute.snapshot.paramMap.get('ticket_id'));
        console.log('@@@@@ this.ticket_id:'+this.ticket_id);
        
        if (this.ticket_id !== 'NA'){
        console.log('if done @@@@@ this.ticket_id:'+this.ticket_id);

        this._serTicketDetails.getTicketDetails(this.ticket_id)
          .then(res => {
            console.log("Inside Response this._serTicketDetails.getRefMaster");
            console.log(res);
            console.log('------------')
            console.log(res['dbQryResponse']);
            console.log(res['dbQryStatus']);
            this.ticket_data = {
              "dbQryResponse": res['dbQryResponse'][0],
              "dbQryStatus": res['dbQryStatus']
            };
            console.log('------*******--------');
            console.log(this.ticket_data['dbQryResponse']);
            console.log('------@@@@@@@--------');
            console.log(this.ticket_data.dbQryResponse);
            this.ticket_data = this.ticket_data.dbQryResponse;

            this.parentForm.get('fctlTicket_no').setValue(this.ticket_data.ticket_no);
            this.parentForm.get('fctlSummary').setValue(this.ticket_data.summary);
            this.parentForm.get('fctlDescription').setValue(this.ticket_data.description);
            this.parentForm.get('fctlIssueType').setValue(this.ticket_data.issue_type);
            this.parentForm.get('fctlIssueStatus').setValue(this.ticket_data.issue_status);
            this.parentForm.get('fctlSeverity').setValue(this.ticket_data.severity);
            this.parentForm.get('fctlPriority').setValue(this.ticket_data.priority);
            this.parentForm.get('fctlEnvironment').setValue(this.ticket_data.environment);
            this.parentForm.get('fctlCreatedDate').setValue(this.ticket_data.created_date);
            this.parentForm.get('fctlCreatedBy').setValue(this.ticket_data.created_by);
            console.log('------@@@@@@@--------');
            console.log(this.parentForm.get('fctlPriority').value);
            this.isLoaded = true;
            this._serNgxSpinner.hide();
          });

        }
      }
      );
      // New Entry end

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

  // markCellToEdit(e,formControl){
  //   console.log(e);
  //   console.log(formControl);
  //   this.parentForm.get(formControl).enable();
  // }

  setReportedBy(e){
    console.log('*************************');
    console.log(e);
    console.log(this.parentForm.status);
    console.log(this.parentForm.valid);
    console.log(this.parentForm.getRawValue());
  }

  showSpinner(){
    console.log('Show Spinner Called');
    // this._serNgxSpinner.show();
    // setTimeout(()=>{
    //   this._serNgxSpinner.hide();
    // },3000)

  }
}
