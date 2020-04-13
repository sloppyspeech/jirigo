import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
import { StaticDataService  } from '../../../services/static-data.service';
// import { EventEmitter } from 'protractor';
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {
  createTicketFB:FormGroup;
  createdDate:any;
  modifiedDate:any;
  environment:string="Environment";
  ticketEnvRef:[any];
  ticketIssueStatusesRef:[any];
  ticketPrioritiesRef:[any];
  ticketSeveritiesRef:[any];
  ticketIssueTypesRef:[any];

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
              private _ngxSpinner:NgxSpinnerService) { 
              
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
                            },1500)
                           }
                     );
                
                this.issueTypeO=new EventEmitter;
              }


  ngOnInit(): void {
    console.log("NgOnInit");
    
    this.createTicketFB= this._formBuilder.group({
      fctlSummary:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlDescription:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlIssueType:new FormControl({ value: 'Issue Type', disabled: false }, Validators.required),
      fctlIssueStatus:new FormControl({ value: 'Issue Type', disabled: false }, Validators.required),
      fctlSeverity:new FormControl({ value: 'Severity', disabled: false }, Validators.required),
      fctlPriority:new FormControl({ value: 'Priority', disabled: false }, Validators.required),
      fctlEnvironment:new FormControl({ value: 'Environment', disabled: false }, Validators.required),
      fctlCreatedDate:new FormControl({ value:this._calendar.getToday() , disabled: true }, Validators.required),
      fctlCreatedBy:new FormControl({ value:'', disabled: false }, Validators.required),
      fctlIsBlocking:new FormControl({ value:false, disabled: false }),
      fctlModifiedDate:new FormControl({ value:'', disabled: true }),
      fctlModifiedBy:new FormControl({ value:'', disabled: true }),
      fctlReportedBy:new FormControl({ value:'', disabled: false }, Validators.required),
      fctlReportedDate:new FormControl({ value:'', disabled: false }, Validators.required),
      fctlComment:new FormControl({ value: '', disabled: true })
    });
    
  }

  onSubmit(){
    console.log(this.createTicketFB.get('fctlSummary').value);
    console.log(this.createTicketFB.get('fctlDescription').value);
    console.log(this.createTicketFB.get('fctlIssueType').value);
    console.log(this.createTicketFB.get('fctlSeverity').value);
    console.log(this.createTicketFB.get('fctlPriority').value);
    console.log(this.createTicketFB.get('fctlStatusType').value);
    console.log(this.createTicketFB.get('fctlIsBlocking').value);
    console.log(this.createTicketFB.get('fctlEnvironment').value);
    console.log(this.createTicketFB.get('fctlCreatedDate').value);
    console.log(this.createTicketFB.get('fctlCreatedBy').value);
    console.log(this.createTicketFB.status);
    console.log(this.createTicketFB.valid);
    console.log('===============================');
    console.log(this.createTicketFB.getRawValue());
    console.log('===============================');

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

  showSpinner(){
    console.log('Show Spinner Called');
    this._ngxSpinner.show();
    setTimeout(()=>{
      this._ngxSpinner.hide();
    },3000)

  }
}
