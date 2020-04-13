import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { StaticDataService } from '../../../services/static-data.service';
import { TicketDetailsService } from '../../../services/tickets/ticket-details.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
@Component({
  selector: 'app-create-ticket',
  templateUrl: './view-edit-tickets.component.html',
  styleUrls: ['./view-edit-tickets.component.css']
})
export class ViewEditTicketsComponent implements OnInit {
  isLoaded: boolean = false;
  viewModifyTicketFB: FormGroup;
  createdDate: any;
  modifiedDate: any;
  environment: string = "Environment";
  ticketEnvRef: [any];
  ticketIssueStatusesRef: [any];
  ticketPrioritiesRef: [any];
  ticketSeveritiesRef: [any];
  ticketIssueTypesRef: [any];
  ticket_data: any;
  ticket_no: string;
  ticket_issue_type:string;
  ticket_id:string;

  editorStyle = {
    height: '200px'
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image']                         // link and image, video
    ]
  };


  @Input()
  issueType: string;
  // viewModifyTicketFB:FormGroup;

  @Output()
  issueTypeO: EventEmitter<any> = new EventEmitter();


  constructor(private _formBuilder: FormBuilder,
    private _staticRefData: StaticDataService,
    private _calendar: NgbCalendar,
    private _activatedRoute: ActivatedRoute,
    private _serTicketDetails: TicketDetailsService,
    private _serNgxSpinner:NgxSpinnerService) {

      this.viewModifyTicketFB = this._formBuilder.group({
        fctlTicket_id: new FormControl({ value: '', disabled: true }),
        fctlTicket_no: new FormControl({ value: '', disabled: true }),
        fctlSummary: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlDescription: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlIssueType: new FormControl({ value: '', disabled: false }, Validators.required),
        fctlIssueStatus: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlSeverity: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlPriority: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlEnvironment: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlCreatedDate: new FormControl({ value: '', disabled: true }),
        fctlCreatedBy: new FormControl({ value: '', disabled: true }),
        fctlIsBlocking: new FormControl({ value: false, disabled: true }),
        fctlModifiedDate: new FormControl({ value: '', disabled: true }),
        fctlModifiedBy: new FormControl({ value: '', disabled: true }),
        fctlReportedBy: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlReportedDate: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlComment: new FormControl({ value: '', disabled: true })
      });




  }


  ngOnInit(): void {
    console.log("NgOnInit");
    this.isLoaded = false;
    this.ticket_id = this._activatedRoute.snapshot.paramMap.get('ticket_id');
    this.viewModifyTicketFB.get('fctlTicket_id').setValue(this.ticket_id);
    this._serNgxSpinner.show();
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
        console.log(this._activatedRoute.snapshot.paramMap.get('ticket_id'));
        

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

            this.viewModifyTicketFB.get('fctlTicket_no').setValue(this.ticket_data.ticket_no);
            this.viewModifyTicketFB.get('fctlSummary').setValue(this.ticket_data.summary);
            this.viewModifyTicketFB.get('fctlDescription').setValue(this.ticket_data.description);
            this.viewModifyTicketFB.get('fctlIssueType').setValue(this.ticket_data.issue_type);
            this.viewModifyTicketFB.get('fctlIssueStatus').setValue(this.ticket_data.issue_status);
            this.viewModifyTicketFB.get('fctlSeverity').setValue(this.ticket_data.severity);
            this.viewModifyTicketFB.get('fctlPriority').setValue(this.ticket_data.priority);
            this.viewModifyTicketFB.get('fctlEnvironment').setValue(this.ticket_data.environment);
            this.viewModifyTicketFB.get('fctlCreatedDate').setValue(this.ticket_data.created_date);
            this.viewModifyTicketFB.get('fctlCreatedBy').setValue(this.ticket_data.created_by);
            console.log('------@@@@@@@--------');
            console.log(this.viewModifyTicketFB.get('fctlPriority').value);
            this.isLoaded = true;
            this._serNgxSpinner.hide();
          });


      }
      );

  }

  onSubmit() {
    console.log(this.viewModifyTicketFB.get('fctlSummary').value);
    console.log(this.viewModifyTicketFB.get('fctlDescription').value);
    console.log(this.viewModifyTicketFB.get('fctlIssueType').value);
    console.log(this.viewModifyTicketFB.get('fctlSeverity').value);
    console.log(this.viewModifyTicketFB.get('fctlPriority').value);
    console.log(this.viewModifyTicketFB.get('fctlEnvironment').value);
    console.log(this.viewModifyTicketFB.get('fctlCreatedDate').value);
    console.log(this.viewModifyTicketFB.get('fctlCreatedBy').value);
    console.log(this.viewModifyTicketFB.getRawValue());
    console.log(this.viewModifyTicketFB.status);
    console.log(this.viewModifyTicketFB.valid);
    // alert("submitted");
  }

  get creTickForm() {
    return this.viewModifyTicketFB.controls;
  }

  setEnvironment1(e) {
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e.target.value);
    // console.log(envSelected);
    // this.viewModifyTicketFB.controls.fctlIssueType.setValue(envSelected);

  }

  setEnvironment(e, f) {
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e);
    // console.log(envSelected);
    // this.viewModifyTicketFB.controls.fctlIssueType.setValue(envSelected);

  }
  setIssueType(e, issueTypeSelected) {
    // alert("Alert Called");
    console.log("setIssueType Called");
    console.log(issueTypeSelected);
    this.viewModifyTicketFB.get('fctlIssueType').setValue(issueTypeSelected);
    this.viewModifyTicketFB.controls.fctlIssueType.setValue(issueTypeSelected);
    // this.issueTypeO.emit(issueTypeSelected);
  }
  setReportedBy(e){
    console.log('*************************');
    console.log(e);
    console.log(this.viewModifyTicketFB.status);
    console.log(this.viewModifyTicketFB.getRawValue());
  }

  markCellToEdit(e, formControl) {
    console.log(e);
    console.log(formControl);
    this.viewModifyTicketFB.get(formControl).enable();
  }
}
