import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, Output,EventEmitter, ɵConsole } from '@angular/core';
import { FormBuilder,FormGroup,FormControl,Validators } from '@angular/forms';
import { StaticDataService  } from '../../../services/static-data.service';
import { TicketDetailsService  } from '../../../services/tickets/ticket-details.service';
import { UsersService  } from '../../../services/users/users.service';
import { NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import  { Router  } from '@angular/router';

import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';


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
  newTicketNo:string="";
  editorStyle = {
    "height": '200px',
    "background-color":"white"
  };

  config={
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }]
    ]
  };

  @Input()
  issueType:string;

  @Output()
  issueTypeO: EventEmitter<any> = new EventEmitter();

  modalAlertConfig={
    modalType :'',
    showModal:false,
    title:'',
    modalContent:'',
    cancelButtonLabel:'',
    confirmButtonLabel:'',
    dialogCanceled:'',
    dialogConfirmed:'',
    dialogClosed:''
    };

  constructor(private _formBuilder:FormBuilder,
              private _staticRefData:StaticDataService,
              private _calendar: NgbCalendar,
              private _NgxSpinner:NgxSpinnerService,
              private _serTicketDetails:TicketDetailsService,
              private _serUsers:UsersService,
              private _router:Router) { 
              
              this._NgxSpinner.show(); 
              console.log("Calling the New Ref Master");
              this._staticRefData.getRefTicketMaster(localStorage.getItem('currentProjectId'))
                .then(res=>{
                            console.log(res);
                            this.ticketEnvRef=res.Environments;
                            this.ticketIssueStatusesRef=res.IssueStatuses;
                            this.ticketIssueTypesRef=res.IssueTypes;
                            this.ticketPrioritiesRef=res.Priorities;
                            this.ticketSeveritiesRef=res.Severities;
                            console.log("here:"+JSON.stringify(this.ticketEnvRef));
                            console.log("ticketIssueStatusesRef:"+JSON.stringify(this.ticketIssueStatusesRef));
                            console.log("ticketPrioritiesRef:"+JSON.stringify(this.ticketPrioritiesRef));
                            console.log("ticketSeverityRef:"+JSON.stringify(this.ticketSeveritiesRef));
                            console.log("ticketIssueTypesRef:"+JSON.stringify(this.ticketIssueTypesRef));
                            setTimeout(()=>{
                              this._NgxSpinner.hide();
                            },1500)
                           }
                     );
                
                this.issueTypeO=new EventEmitter;
              }


  ngOnInit(): void {
    this.initializeModalAlertConfig();
    console.log("NgOnInit");
    
    this.createTicketFB= this._formBuilder.group({
      fctlProjectName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
      fctlSummary:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlDescription:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlIssueType:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlIssueStatus:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlSeverity:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlPriority:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlModule:new FormControl({ value: '', disabled: false }),
      fctlEnvironment:new FormControl({ value: '', disabled: false }, Validators.required),
      fctlCreatedDate:new FormControl({ value:this._calendar.getToday() , disabled: true }),
      fctlCreatedBy:new FormControl({ value:'', disabled: false }),
      fctlIsBlocking:new FormControl({ value:false, disabled: false }),
      fctlModifiedDate:new FormControl({ value:'', disabled: true }),
      fctlModifiedBy:new FormControl({ value:'', disabled: true }),
      fctlReportedBy:new FormControl({ value:'', disabled: false }, Validators.required),
      fctlReportedDate:new FormControl({ value:'', disabled: false }, Validators.required),
      fctlComment:new FormControl({ value: '', disabled: true }),
      fctlAssigneeName:new FormControl({ value: '', disabled: false }),
      fctlChannel:new FormControl({ value: '', disabled: false }, Validators.required)
    });
    
  }

  onSubmit(){
    let formData:any;
    console.log("Here in On Submit");
    console.log(this.createTicketFB.status);
    console.log(this.createTicketFB.valid);
    console.log('===============================');
    console.log(this.createTicketFB.getRawValue());
    console.log('===============================');
    formData={
      "project_name":this.createTicketFB.get('fctlProjectName').value,
      "summary":this.createTicketFB.get('fctlSummary').value,
      "description":this.createTicketFB.get('fctlDescription').value,
      "severity":this.createTicketFB.get('fctlSeverity').value,
      "priority":this.createTicketFB.get('fctlPriority').value,
      "module":this.createTicketFB.get('fctlModule').value,
      "issue_type":this.createTicketFB.get('fctlIssueType').value,
      "issue_status":this.createTicketFB.get('fctlIssueStatus').value ,
      "is_blocking":this.createTicketFB.get('fctlIsBlocking').value? 'Y':'N',
      "environment":this.createTicketFB.get('fctlEnvironment').value,
      "assignee_name":this.createTicketFB.get('fctlAssigneeName').value,
      "created_by":localStorage.getItem('loggedInUserId'),
      "created_date":this.createTicketFB.get('fctlCreatedDate').value,
      "reported_by": this.createTicketFB.get('fctlReportedBy').value,
      "reported_date":this.createTicketFB.get('fctlReportedDate').value,
      "channel":this.createTicketFB.get('fctlChannel').value
    }
    console.log('@@------@@');
    console.log(formData);

    this._NgxSpinner.show();
    this.initializeModalAlertConfig();
    this.modalAlertConfig.cancelButtonLabel="";
    this.modalAlertConfig.confirmButtonLabel="Ok";
    this.modalAlertConfig.dialogConfirmed="TicketCreationModalConfirm";
    this.modalAlertConfig.dialogCanceled="TicketCreationModalClosed";
    this.modalAlertConfig.dialogClosed="TicketCreationModalClosed";
    
    this._serTicketDetails.creTicket(formData)
        .subscribe(res=>{
          console.log("Create Ticket Output :"+JSON.stringify(res));
          console.log("Create Ticket Output :"+res['dbQryStatus']);
          console.log(res['dbQryResponse']);

          if (res['dbQryStatus'] == 'Success'){
            this.newTicketNo=res['dbQryResponse']['ticket_no'];
            this.createTicketFB.reset();
            this.modalAlertConfig.dialogConfirmed="TicketCreationModalSuccessConfirm";
            this.modalAlertConfig.title="Ticket Creation Successful";
            this.modalAlertConfig.modalContent= this.newTicketNo+ "  created successfully";
            this.modalAlertConfig.modalType="success";
          }
          else{
            this.modalAlertConfig.dialogConfirmed="TicketCreationModalFailureConfirm";
            this.modalAlertConfig.title="Ticket Creation Failed";
            this.modalAlertConfig.modalContent="Ticket creation failed. Contact Adminstrator.";
            this.modalAlertConfig.modalType="danger";
          }
          this.modalAlertConfig.showModal=true;
          this._NgxSpinner.hide();

        })

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
    this._NgxSpinner.show();
    setTimeout(()=>{
      this._NgxSpinner.hide();
    },3000)
  }

  cancelForm(){
    if (this.createTicketFB.dirty){
      alert('Unsaved Data');
    }
    this.createTicketFB.reset();
  }


  modalAlertAction(param){
    console.log(param);
    this.modalAlertConfig.showModal=false;
    this.modalAlertConfig.modalType='';
    this.modalAlertConfig.modalContent='';
  
    if(param === "TicketCreationModalSuccessConfirm"){
      console.log('/tickets/view-edit-Ticket/'+this.newTicketNo);
      this._router.navigate(['/tickets/view-edit-tickets'],{queryParams:{'ticket_no':this.newTicketNo}});

      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
      this._router.onSameUrlNavigation = 'reload';
    }
    else if( param === "TicketCreationModalFailureConfirm"  ||
             param === "TicketCreationModalClosed" ){
      this._router.navigateByUrl('/tickets/list-tickets');
    }
  
  }
  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log();
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
}

initializeModalAlertConfig(){
  this.modalAlertConfig={
    modalType :'',
    showModal:false,
    title:'',
    modalContent:'',
    cancelButtonLabel:'',
    confirmButtonLabel:'',
    dialogCanceled:'',
    dialogConfirmed:'',
    dialogClosed:''
};
}

}
