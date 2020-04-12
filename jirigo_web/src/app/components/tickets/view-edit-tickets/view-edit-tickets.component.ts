import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
import { StaticDataService  } from '../../../services/static-data.service';
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './view-edit-tickets.component.html',
  styleUrls: ['./view-edit-tickets.component.css']
})
export class ViewEditTicketsComponent implements OnInit {
  createTicketFB:FormGroup;
  createdDate:any;
  modifiedDate:any;
  environment:string="Environment";
  ticketEnvRef:[any];
  ticketIssueStatusesRef:[any];
  ticketPrioritiesRef:[any];
  ticketSeveritiesRef:[any];
  ticketIssueTypesRef:[any];
  ticket_data:any;
  ticket_no:string;

  editorStyle = {
    height: '200px'
  };

  config={
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
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
  issueType:string;

  @Output()
  issueTypeO: EventEmitter<any> = new EventEmitter();


  constructor(private _formBuilder:FormBuilder,
              private _staticRefData:StaticDataService,
              private _calendar: NgbCalendar,
              private _activatedRoute:ActivatedRoute) { 
                
                this._staticRefData.getRefMaster()
                .then(res=>{
                            console.log(res);
                            this.ticketEnvRef=res.Environments;
                            this.ticketIssueStatusesRef=res.IssueStatuses;
                            this.ticketPrioritiesRef=res.Priorities;
                            this.ticketSeveritiesRef=res.Severities;
                            this.ticketIssueTypesRef=res.IssueTypes;
                            console.log("here:"+JSON.stringify(this.ticketEnvRef));
                            console.log("ticketIssueStatusesRef:"+JSON.stringify(this.ticketIssueStatusesRef));
                            console.log("ticketPrioritiesRef:"+JSON.stringify(this.ticketPrioritiesRef));
                            console.log("ticketSeverityRef:"+JSON.stringify(this.ticketSeveritiesRef));
                            console.log("ticketIssueTypesRef:"+JSON.stringify(this.ticketIssueTypesRef));
                           }
                     );
                
                this.issueTypeO=new EventEmitter;
                console.log('Activated Route check');
                console.log(this._activatedRoute.snapshot.paramMap.get('ticket_id'));
                this.ticket_no=this._activatedRoute.snapshot.paramMap.get('ticket_id');
                this.ticket_data={
                  "dbQryResponse": [
                      {
                          "created_by": 1,
                          "created_date": "2020-04-10T19:49:43.902428",
                          "description": "Create UAT VM",
                          "environment": "UAT",
                          "is_blocking": "N",
                          "issue_status": "Open",
                          "issue_type": "Bug",
                          "modified_by": null,
                          "modified_date": null,
                          "priority": "Low",
                          "severity": "Low",
                          "summary": "Create UAT VM",
                          "ticket_int_id": 10,
                          "ticket_no": "Proj-10"
                      }
                  ],
                  "dbQryStatus": "Success"
              };
              console.log(this.ticket_data.dbQryResponse[0]);
              this.ticket_data=this.ticket_data.dbQryResponse[0];
              }


  ngOnInit(): void {
    console.log("NgOnInit");
    
    this.createTicketFB= this._formBuilder.group({
      fctlTicket_no:new FormControl({ value: this.ticket_data.ticket_no, disabled: true }),
      fctlSummary:new FormControl({ value: this.ticket_data.summary, disabled: true }, Validators.required),
      fctlDescription:new FormControl({ value: this.ticket_data.description, disabled: true }, Validators.required),
      fctlIssueType:new FormControl({ value: this.ticket_data.issue_type, disabled: true }, Validators.required),
      fctlIssueStatus:new FormControl({ value: this.ticket_data.issue_status, disabled: true }, Validators.required),
      fctlSeverity:new FormControl({ value: this.ticket_data.severity, disabled: true }, Validators.required),
      fctlPriority:new FormControl({ value: this.ticket_data.priority, disabled: true }, Validators.required),
      fctlEnvironment:new FormControl({ value: this.ticket_data.environment, disabled: true }, Validators.required),
      fctlCreatedDate:new FormControl({ value:this.ticket_data.created_date , disabled: true }, Validators.required),
      fctlCreatedBy:new FormControl({ value:this.ticket_data.created_by, disabled: true }, Validators.required),
      fctlIsBlocking:new FormControl({ value:false, disabled: true }),
      fctlModifiedDate:new FormControl({ value:'', disabled: true }),
      fctlModifiedBy:new FormControl({ value:'', disabled: true }),
      fctlReportedBy:new FormControl({ value:'', disabled: true }, Validators.required),
      fctlReportedDate:new FormControl({ value:'', disabled: true }, Validators.required),
      fctlComment:new FormControl({ value: '', disabled: true })
    });
    
  }

  onSubmit(){
    console.log(this.createTicketFB.get('fctlSummary').value);
    console.log(this.createTicketFB.get('fctlDescription').value);
    console.log(this.createTicketFB.get('fctlIssueType').value);
    console.log(this.createTicketFB.get('fctlSeverity').value);
    console.log(this.createTicketFB.get('fctlPriority').value);
    console.log(this.createTicketFB.get('fctlEnvironment').value);
    console.log(this.createTicketFB.get('fctlCreatedDate').value);
    console.log(this.createTicketFB.get('fctlCreatedBy').value);
    console.log(this.createTicketFB.status);
    console.log(this.createTicketFB.valid);
    // alert("submitted");
  }

  get creTickForm(){
    return this.createTicketFB.controls;
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
    this.createTicketFB.get('fctlIssueType').setValue(issueTypeSelected);
    this.createTicketFB.controls.fctlIssueType.setValue(issueTypeSelected);
    // this.issueTypeO.emit(issueTypeSelected);
  }

  markCellToEdit(e,formControl){
    console.log(e);
    console.log(formControl);
    this.createTicketFB.get(formControl).enable();
  }
}
