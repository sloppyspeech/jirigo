import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { StaticDataService } from '../../../services/static-data.service';
import { TicketDetailsService } from '../../../services/tickets/ticket-details.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Router  } from '@angular/router';
import { faClone,faEdit } from '@fortawesome/free-solid-svg-icons';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './view-edit-tickets.component.html',
  styleUrls: ['./view-edit-tickets.component.css'],
  providers:[MessageService]
})
export class ViewEditTicketsComponent implements OnInit {
  faClone=faClone;
  faEdit=faEdit;
  isLoaded: boolean = false;
  viewEditFormEditBtnEnabled:boolean=true;
  viewModifyTicketFB: FormGroup;
  viewModifyTicketFBState: any;
  createdDate: any;
  modifiedDate: any;
  environment: string = "Environment";
  ticket_data: any;
  ticket_no: string;
  ticket_issue_type:string;
  viewModifyTicketFCList;
  displayPageDirtyDialog:boolean=false;
  leaveViewEditPageUnsaved:boolean=false;


  editorStyle = {
    height: '200px'
  };

  config={
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      // ['blockquote', 'code-block'],
      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }]
      // ['clean'],                                         // remove formatting button
      // ['link', 'image']                         // link and image, video
    ]
  };


  @Input()
  issueType: string;
  // viewModifyTicketFB:FormGroup;

  @Output()
  issueTypeO: EventEmitter<any> = new EventEmitter();


  constructor(private _formBuilder: FormBuilder,
    private _staticRefData: StaticDataService,
    private _activatedRoute: ActivatedRoute,
    private _serTicketDetails: TicketDetailsService,
    private _serNgxSpinner:NgxSpinnerService,
    private _router:Router,
    private _toastService: MessageService) {

      this.viewModifyTicketFB = this._formBuilder.group({
        fctlTicketId: new FormControl({ value: '', disabled: true }),
        fctlTicketNo: new FormControl({ value: '', disabled: true }),
        fctlSummary: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlDescription: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlIssueType: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlIssueStatus: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlSeverity: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlPriority: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlEnvironment: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlModule: new FormControl({ value: '', disabled: true }),
        fctlCreatedDate: new FormControl({ value: '', disabled: true }),
        fctlCreatedBy: new FormControl({ value: '', disabled: true }),
        fctlIsBlocking: new FormControl({ value: false, disabled: true }),
        fctlModifiedDate: new FormControl({ value: '', disabled: true }),
        fctlModifiedBy: new FormControl({ value: '', disabled: true }),
        fctlReportedBy: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlReportedDate: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlComment: new FormControl({ value: '', disabled: true }),
        fctlProjectName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
        fctlAssigneeName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true })

      });

  }


  ngOnInit(): void {
    console.log("NgOnInit");
    this.isLoaded = false;
    this.ticket_no = this._activatedRoute.snapshot.paramMap.get('ticket_no');
    console.log('Routed Ticket No :'+this.ticket_no);
    this.viewModifyTicketFB.get('fctlTicketNo').setValue(this.ticket_no);
    this._serNgxSpinner.show();
    this._staticRefData.getRefTicketMaster()
      .then(res => {
        console.log(res);
        
        console.log('Activated Route check');
        console.log(this.ticket_no);
        
        this._serTicketDetails.getTicketDetails(this.ticket_no)
          .then(res => {
            console.log("Inside Response this._serTicketDetails.getRefMaster");
            console.log('------------')
            console.log(res);
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
            this.ticket_no=this.ticket_data.ticket_no;
            this.viewModifyTicketFB.get('fctlTicketNo').setValue(this.ticket_data.ticket_no);
            this.viewModifyTicketFB.get('fctlSummary').setValue(this.ticket_data.summary);
            this.viewModifyTicketFB.get('fctlDescription').setValue(this.ticket_data.description);
            // this.viewModifyTicketFB.get('fctlIssueType').setValue(this.ticket_data.issue_type);
            // this.viewModifyTicketFB.get('fctlIssueStatus').setValue(this.ticket_data.issue_status);
            // this.viewModifyTicketFB.get('fctlSeverity').setValue(this.ticket_data.severity);
            // this.viewModifyTicketFB.get('fctlPriority').setValue(this.ticket_data.priority);
            // this.viewModifyTicketFB.get('fctlEnvironment').setValue(this.ticket_data.environment);
            // this.viewModifyTicketFB.get('fctlCreatedDate').setValue(this.ticket_data.created_date);
            // this.viewModifyTicketFB.get('fctlCreatedBy').setValue(this.ticket_data.created_by);
            // this.viewModifyTicketFB.get('fctlReportedDate').setValue(this.ticket_data.reported_date);
            // this.viewModifyTicketFB.get('fctlReportedBy').setValue(this.ticket_data.reported_by);
            // this.viewModifyTicketFB.get('fctlAssigneeName').setValue(this.ticket_data.assignee_name);
            console.log('------@@@@fctlReportedDate@@@--------');
            console.log(this.viewModifyTicketFB.get('fctlReportedDate').value);
            this.isLoaded = true;
            this._serNgxSpinner.hide();
            this.viewModifyTicketFCList=this.viewModifyTicketFB.controls;
            this.setInitialDataFormValues();
          });
      }
      );
  }

  setInitialDataFormValues(){
    this.viewModifyTicketFBState=this.viewModifyTicketFB.getRawValue();
    console.log('---------@@@@ viewModifyTicketFBInitialState @@@@-------');
    console.log(this.viewModifyTicketFBState.value);
    console.log('------------------------------------------------------');

  }
  disableAllFormControls(){
    Object.keys(this.viewModifyTicketFCList).forEach(control => {
      this.viewModifyTicketFB.get(control).disable();
    });
  }
  enableAllFormControls(){
    Object.keys(this.viewModifyTicketFCList).forEach(control => {
      this.viewModifyTicketFB.get(control).enable();
    });
  }

  setFormBackToIntialState(){
    // this.viewModifyTicketFB.patchValue(this.viewModifyTicketFBState);
    this.reloadComponent();
  }

  updateTicket() {
    let formData:any;

    console.log("updateTicket");
    console.log('===============================');
    console.log(this.viewModifyTicketFB.status);
    console.log(this.viewModifyTicketFB.valid);
    console.log(this.viewModifyTicketFB.getRawValue());
    console.log('===============================');

    formData={
      "ticket_no":this.viewModifyTicketFB.get('fctlTicketNo').value,
      "project_name":this.viewModifyTicketFB.get('fctlProjectName').value,
      "summary":this.viewModifyTicketFB.get('fctlSummary').value,
      "description":this.viewModifyTicketFB.get('fctlDescription').value,
      "severity":this.viewModifyTicketFB.get('fctlSeverity').value,
      "priority":this.viewModifyTicketFB.get('fctlPriority').value,
      "issue_type":this.viewModifyTicketFB.get('fctlIssueType').value,
      "module":this.viewModifyTicketFB.get('fctlModule').value,
      "is_blocking":this.viewModifyTicketFB.get('fctlIsBlocking').value? 'Y':'N',
      "issue_status":this.viewModifyTicketFB.get('fctlIssueStatus').value,
      "environment":this.viewModifyTicketFB.get('fctlEnvironment').value,
      "assignee_name":this.viewModifyTicketFB.get('fctlAssigneeName').value,
      "modified_by":localStorage.getItem('loggedInUserId'),
      "modified_date":this.viewModifyTicketFB.get('fctlCreatedDate').value,
      "reported_by": this.viewModifyTicketFB.get('fctlReportedBy').value,
      "reported_date":this.viewModifyTicketFB.get('fctlReportedDate').value
    }
    console.log('@@------@@');
    console.log(formData);

    this._serTicketDetails.updateTicket(formData)
        .subscribe(res=>{
          console.log("Update Ticket Output :"+JSON.stringify(res));
          console.log("Update Ticket Output :"+res['dbQryStatus']);
          console.log("Update Ticket Output :"+res['dbQryResponse']);
          if (res['dbQryStatus'] == 'Success'){
            this._serNgxSpinner.show();
            this.viewModifyTicketFB.reset();
            // alert("Ticket Updated Successfully.");
            this.reloadComponent();
            this._serNgxSpinner.hide();

          }
          else{
            alert('Ticket Updation Unsuccessful');
          }
        });

    // alert("submitted");
  }

  get creTickForm() {
    return this.viewModifyTicketFB.controls;
  }

  markFormEditable() {
    console.log("Inside markFormEditable");
    let controls=this.viewModifyTicketFB.controls;
    this.enableAllFormControls();
    this.viewEditFormEditBtnEnabled=false;
  }


  cancelViewEditForm(){
    console.log("Inside cancelViewEditForm()");
    console.log("======this.viewModifyTicketFB.dirty======="+this.viewModifyTicketFB.dirty+"==============");
    if (this.viewModifyTicketFB.dirty)
    {
      this.displayPageDirtyDialog=true;
    }
    else{
      this.viewEditFormEditBtnEnabled=true;
      this.disableAllFormControls();
    }
  }

  showDirtyPageDialog(optionSelected){
    
    console.log("======this.leaveViewEditPageUnsaved======="+this.leaveViewEditPageUnsaved+"==============");
    if (optionSelected){
      console.log("Reset Back To Old values");
      console.log(this.viewModifyTicketFB.value);
      console.log(this.viewModifyTicketFBState);
      this.viewEditFormEditBtnEnabled=true;
      this.setFormBackToIntialState();
      this.disableAllFormControls();
    }
      this.displayPageDirtyDialog=false;
  }

  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log();
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
}

cloneTicket(){
  let formData={
    "ticket_no":this.viewModifyTicketFB.get('fctlTicketNo').value,
    "created_by":localStorage.getItem('loggedInUserId')
  }
  this._serNgxSpinner.show();
  this._serTicketDetails.cloneTicket(formData)
  .subscribe(res=>{
    console.log("Clone Ticket Output :"+JSON.stringify(res));
    console.log("Clone Ticket Output :"+res['dbQryStatus']);
    console.log("Clone Ticket Output :"+res['dbQryResponse']);
    if (res['dbQryStatus'] == 'Success'){
      this._serNgxSpinner.show();
      this.viewModifyTicketFB.reset();
        this._serNgxSpinner.hide();
        this._toastService.add({severity:'success', 
        summary:'New Ticket Number : '+res['dbQryResponse']['ticketNo'], 
        detail:'Ticket Cloning Successful'
        });
       setTimeout(() => {
         this.reloadComponent();
       }, 4000);
    }
    else{
      this._toastService.add({severity:'error', 
      summary:'Ticket Cloning Unsuccessful', 
      detail:'Clone Failure'
      });
    }
  });
}

}
