import { TicketLogtimeService } from './../../../services/tickets/ticket-logtime.service';
import { Component, OnInit, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { StaticDataService } from '../../../services/static-data.service';
import { TicketDetailsService } from '../../../services/tickets/ticket-details.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Router  } from '@angular/router';
import { faClone,faEdit,faLink,faClock } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { TimelogComponent } from '../timelog/timelog.component';
import { TicketCommentsComponent } from '../ticket-comments/ticket-comments.component';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './view-edit-tickets.component.html',
  styleUrls: ['./view-edit-tickets.component.css'],
  providers:[MessageService]
})
export class ViewEditTicketsComponent implements OnInit {
  faClone=faClone;
  faEdit=faEdit;
  faLink=faLink;
  faClock=faClock;
  isLoaded: boolean = false;
  viewEditFormEditBtnDisabled:boolean=true;
  viewModifyTicketFB: FormGroup;
  viewModifyTicketFBState: any;
  createdDate: any;
  modifiedDate: any;
  environment: string = "Environment";
  ticket_data: any;
  ticket_no: string;
  clonedTicketNo:string="";
  ticket_issue_type:string;
  viewModifyTicketFCList;
  displayPageDirtyDialog:boolean=false;
  leaveViewEditPageUnsaved:boolean=false;

  buttonGroupOptions:any={
    showTicketDetails:false,
    showTicketComments:false,
    showAudit:false,
    showTimeLog:false
  };
  
  showLinkTicketModal:boolean=false;

  showTicketDetails:boolean=true;
  showTicketComments:boolean=false;
  showAudit:boolean=false;

  //Timelogging
  showMod2:boolean=false;
  activitiesToLogTime:any[]=[];

  tabs:any[]=[
    {label:'Ticket Details',value:'showTicketDetails'},
    {label:'Comments',value:'showTicketComments'},
    {label:'Audit Log',value:'showAudit'},
    {label:'Time Log',value:'showTimeLog'}
  ];

  editorStyle = {
    height: '200px',
    'background-color':'white'
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

  @ViewChild(TimelogComponent) ticketTimeLogChildComponent:TimelogComponent;  
  @ViewChild(TicketCommentsComponent) ticketCommentsChildComponent:TicketCommentsComponent;  

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

  constructor(private _formBuilder: FormBuilder,
    private _staticRefData: StaticDataService,
    private _activatedRoute: ActivatedRoute,
    private _serTicketDetails: TicketDetailsService,
    private _serNgxSpinner:NgxSpinnerService,
    private _router:Router,
    private _toastService: MessageService,
    private _serTicketLogTime: TicketLogtimeService) {

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
        fctlChannel: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlComment: new FormControl({ value: '', disabled: true }),
        fctlProjectName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
        fctlAssigneeName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
        fctlTabOptions: new FormControl({ value: 'Ticket Details'})
      });

  }


  ngOnInit(): void {
    console.log("NgOnInit");
    this.initializeModalAlertConfig();
    this.isLoaded = false;
    this.ticket_no = this._activatedRoute.snapshot.queryParamMap.get('ticket_no');
    console.log('Routed Ticket No :'+this.ticket_no);
    this.viewModifyTicketFB.get('fctlTicketNo').setValue(this.ticket_no);
    this._serNgxSpinner.show();
    this._staticRefData.getRefTicketMaster(localStorage.getItem('currentProjectId'))
      .then(res => {
        console.log(res);
        this.activitiesToLogTime = res.IssueStatuses;
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
            console.log('------@@@@fctlReportedDate@@@--------');
            console.log(this.viewModifyTicketFB.get('fctlReportedDate').value);
            this.isLoaded = true;
            this.viewModifyTicketFCList=this.viewModifyTicketFB.controls;
            this.setInitialDataFormValues();
            this.viewModifyTicketFB.get('fctlTabOptions').setValue('Ticket Details');
            this._serNgxSpinner.hide();
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
      if (control != 'fctlTabOptions'){
        this.viewModifyTicketFB.get(control).disable();
      }
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
    this.initializeModalAlertConfig();
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
      "reported_by": this.viewModifyTicketFB.get('fctlReportedBy').value,
      "reported_date":this.viewModifyTicketFB.get('fctlReportedDate').value,
      "channel":this.viewModifyTicketFB.get('fctlChannel').value
    }
    console.log('@@------@@');
    console.log(formData);

    this.modalAlertConfig.cancelButtonLabel="";
    this.modalAlertConfig.confirmButtonLabel="Ok";
    this.modalAlertConfig.dialogConfirmed="TicketUpdateModalConfirm";
    this.modalAlertConfig.dialogCanceled="TicketUpdateModalClosed";
    this.modalAlertConfig.dialogClosed="TicketUpdateModalClosed";

    this._serTicketDetails.updateTicket(formData)
        .subscribe(res=>{
          console.log("Update Ticket Output :"+JSON.stringify(res));
          console.log("Update Ticket Output :"+res['dbQryStatus']);
          console.log("Update Ticket Output :"+res['dbQryResponse']);
          if (res['dbQryStatus'] == 'Success'){
            this.viewModifyTicketFB.reset();
            this._serNgxSpinner.hide();

            //---
            this.modalAlertConfig.dialogConfirmed="TicketUpdateModalSuccessConfirm";
            this.modalAlertConfig.title="Ticket Update Success";
            this.modalAlertConfig.modalContent=formData['ticket_no'] + "  updated successfully";
            this.modalAlertConfig.modalType="success";
            this.modalAlertConfig.showModal=true;
            //---

          }
          else{
            this._serNgxSpinner.hide(); 
            this.modalAlertConfig.dialogConfirmed="TicketUpdateModalFailureConfirm";
            this.modalAlertConfig.title="Ticket Update Failed";
            this.modalAlertConfig.modalContent=formData['ticket_no']  + "  update failed. Contact Adminstrator.";
            this.modalAlertConfig.modalType="danger";
            this.modalAlertConfig.showModal=true;
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
    // this.enableAllFormControls();
    this.viewEditFormEditBtnDisabled=false;
    // Object.keys(this.viewModifyTicketFB.controls).forEach(e=>{
    //   console.log(e+" : "+this.viewModifyTicketFB.controls[e].valid)
    // });
    this.viewModifyTicketFB.get('fctlSummary').enable();
    this.viewModifyTicketFB.get('fctlDescription').enable();
  }


  cancelViewEditForm(){
    console.log("Inside cancelViewEditForm()");
    console.log("======this.viewModifyTicketFB.dirty======="+this.viewModifyTicketFB.dirty+"==============");
    if (this.viewModifyTicketFB.dirty)
    {
      this.modalAlertConfig.title="Unsaved Data Alert";
      this.modalAlertConfig.cancelButtonLabel="Discard";
      this.modalAlertConfig.confirmButtonLabel="Keep";
      this.modalAlertConfig.modalType="warning";
      this.modalAlertConfig.modalContent="There are unsaved Items on this page. What do you want to do with them ?";
      this.modalAlertConfig.dialogConfirmed="Keep";
      this.modalAlertConfig.dialogCanceled="Discard";
      this.modalAlertConfig.dialogClosed="Discard";
      this.modalAlertConfig.showModal=true;
    }
    else{
      this.viewEditFormEditBtnDisabled=true;
      this.disableAllFormControls();
    }


  }

  discardChangesOnCancel(){
    console.log("======this.leaveViewEditPageUnsaved======="+this.leaveViewEditPageUnsaved+"==============");
      console.log("Reset Back To Old values");
      console.log(this.viewModifyTicketFB.value);
      console.log(this.viewModifyTicketFBState);
      this.viewEditFormEditBtnDisabled=true;
      this.setFormBackToIntialState();
      this.disableAllFormControls();
      this.modalAlertConfig.showModal=false;
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

  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log();
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    // this._router.navigate([this._router.url]);
    let currentUrl = this._router.url;
    console.log(currentUrl.substring(0,currentUrl.indexOf('?')));
    console.log(this._activatedRoute.snapshot.queryParams);
    this._router.navigate([currentUrl.substring(0,currentUrl.indexOf('?'))],{queryParams: this._activatedRoute.snapshot.queryParams});

}

cloneTicket(){
  let formData={
    "ticket_no":this.viewModifyTicketFB.get('fctlTicketNo').value,
    "created_by":localStorage.getItem('loggedInUserId')
  };
  this.initializeModalAlertConfig();
  this.modalAlertConfig.cancelButtonLabel="";
  this.modalAlertConfig.confirmButtonLabel="Ok";
  this.modalAlertConfig.dialogConfirmed="TicketCloneModalConfirm";
  this.modalAlertConfig.dialogCanceled="TicketCloneModalClosed";
  this.modalAlertConfig.dialogClosed="TicketCloneModalClosed";
  
  this._serNgxSpinner.show();
  this._serTicketDetails.cloneTicket(formData)
  .subscribe(res=>{
    console.log("Clone Ticket Output :"+JSON.stringify(res));
    console.log("Clone Ticket Output :"+res['dbQryStatus']);
    console.log(res['dbQryResponse']);
    if (res['dbQryStatus'] == 'Success'){
      this.viewModifyTicketFB.reset();
      this._serNgxSpinner.hide();
      this.clonedTicketNo=res['dbQryResponse']['clonedTicketNo'];
      //---
      this.modalAlertConfig.dialogConfirmed="TicketCloneModalSuccessConfirm";
      this.modalAlertConfig.title="Ticket Cloned";
      this.modalAlertConfig.modalContent=formData['ticket_no'] + "  cloned successfully to "+ this.clonedTicketNo;
      this.modalAlertConfig.modalType="success";
      this.modalAlertConfig.showModal=true;
      //---

    }
    else{
      this._serNgxSpinner.hide(); 
      this.modalAlertConfig.dialogConfirmed="TicketCloneModalFailureConfirm";
      this.modalAlertConfig.title="Ticket cloning failed";
      this.modalAlertConfig.modalContent=formData['ticket_no']  + "  cloning failed. Contact Adminstrator.";
      this.modalAlertConfig.modalType="danger";
      this.modalAlertConfig.showModal=true;
    }
  });
}

enableSelectedTabOptions(tab){
  console.log("========enableSelectedTabOptions=========");
  for (let key in this.buttonGroupOptions){
    console.log(key +":"+tab);
    if(key == tab)
      this.buttonGroupOptions[key]=true;
    else{
      this.buttonGroupOptions[key]=false;
    }
  }
}

tabSelected(e){
  // Since the control is part of the form, clicking on a tab option
  // marks the form as dirty. So to avoid enabling the submit button
  // set the control to pristine
  this.viewModifyTicketFB.get('fctlTabOptions').markAsPristine();
  
  console.log(this.buttonGroupOptions);
  this.enableSelectedTabOptions(e.value);
  console.log(this.viewModifyTicketFB.getRawValue());

  Object.keys(this.viewModifyTicketFB.controls).forEach(e=>{
    console.log(e+" : "+this.viewModifyTicketFB.controls[e].dirty)
  });

  console.log("viewModifyTicketFB.dirty:"+this.viewModifyTicketFB.dirty);
  console.log("viewModifyTicketFB.touched:"+this.viewModifyTicketFB.touched);
  console.log("viewModifyTicketFB.errors:"+this.viewModifyTicketFB.errors);
  console.log("viewModifyTicketFB.viewModifyTicketFB.valid:"+this.viewModifyTicketFB.valid);
}

modalAlertAction(param){
  console.log(param);
  console.log(this.clonedTicketNo);
  this.modalAlertConfig.showModal=false;
  this.modalAlertConfig.modalType='';
  this.modalAlertConfig.modalContent='';

  if (param === "Discard"){
    this.discardChangesOnCancel();
  }
  //-- Ticket Update action finished (success or failure ), reloaded component
  else if( param === "TicketUpdateModalSuccessConfirm"  || 
           param === "TicketUpdateModalFailureConfirm"  ||
           param === "TicketUpdateModalClosed" ){

      this.reloadComponent();
  }
  else if(param === "TicketCloneModalSuccessConfirm"){
    console.log('/tickets/view-edit-Ticket/'+this.clonedTicketNo);
    this._router.navigate(['/tickets/view-edit-tickets'],{queryParams:{'ticket_no':this.clonedTicketNo}});
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
  }
  else if( param === "TicketCloneModalFailureConfirm"  ||
           param === "TicketCloneModalClosed" ){
    this.reloadComponent();
  }

}


timeLoggerCancelled(){
  console.log('timeLoggerCancelled called ');
}

timeLoggerConfirmed(data){
  // this._serNgxSpinner.show();
  console.log('timeLoggerConfirmed called ');
  console.log(data);
  let adate=new Date(data['actualDate']['year'],data['actualDate']['month']-1,data['actualDate']['day']);
  console.log(adate);
  let inpData={
    ticket_no:this.ticket_no,
    activity:data['selectedActivity'],
    actual_time_spent:data['loggedTime'],
    other_activity_comment:data['otherActivity'],
    timelog_comment:data['comment'],
    time_spent_by:localStorage.getItem('loggedInUserId'),
    actual_date: adate
  }
console.log(inpData);
  this._serTicketLogTime.createTimeLog(inpData)
      .subscribe(res=>{
        console.log(res);
        if (res['dbQryStatus'] == 'Success' && res['dbQryResponse']){
            console.log("ALL OKAY");
            // this.reloadComponent();
            this.ticketTimeLogChildComponent.getTimeLoggingData();
            // this._serNgxSpinner.hide();
        }
        else{
            console.log(res);
            console.log("Problem");
            this._serNgxSpinner.hide();
        }
      });
}

enableTicketComments (e){
  console.log('enableTicketComments');
  console.log(e);
  this.buttonGroupOptions.showTicketComments=true;
  this.enableSelectedTabOptions('showTicketComments');
  this.ticketCommentsChildComponent.getTicketComments(this.ticket_no);
}

}
