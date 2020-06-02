import { Subscription } from 'rxjs';
import { UtilsService } from './../../../services/shared/utils.service';
import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { StaticDataService } from '../../../services/static-data.service';
import { TaskDetailsService } from '../../../services/tasks/task-details.service';
import { TaskLogtimeService} from '../../../services/tasks/task-logtime.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Router  } from '@angular/router';
import { faClone,faEdit, faTshirt,faLink,faClock,faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { MessageService} from 'primeng/api';

@Component({
  selector: 'app-view-edit-task',
  templateUrl: './view-edit-task.component.html',
  styleUrls: ['./view-edit-task.component.css'],
  providers:[MessageService]
})

export class ViewEditTaskComponent implements OnInit {
  faClone=faClone;
  faEdit=faEdit;
  faLink=faLink;
  faClock=faClock;
  faPaperclip=faPaperclip;
  isLoaded: boolean = false;
  viewEditFormEditBtnEnabled:boolean=true;
  viewModifyTaskFB: FormGroup;
  viewModifyTaskFBState: any;
  createdDate: any;
  modifiedDate: any;
  environment: string = "Environment";
  task_data: any;
  task_no: string;
  clonedTaskNo:string="";
  task_issue_type:string;
  viewModifyTaskFCList;
  displayPageDirtyDialog:boolean=false;
  leaveViewEditPageUnsaved:boolean=false;
  buttonGroupOptions:any={
    showTaskDetails:false,
    showTaskComments:false,
    showAudit:false,
    showDependsOn:false,
    showRelatedTo:false,
    showDuplicatedBy:false,
    showTimeLog:false
  };
  showMod2:boolean=false;
  showLinkTaskModal:boolean=false;
  activitiesToLogTime:any[]=[];

  tabs:any[]=[
    {label:'Task Details',value:'showTaskDetails'},
    {label:'Comments',value:'showTaskComments'},
    {label:'Audit Log',value:'showAudit'},
    {label:'Depends On',value:'showDependsOn'},
    {label:'Related To',value:'showRelatedTo'},
    {label:'Duplicated By',value:'showDuplicatedBy'},
    {label:'Time Logged',value:'showTimeLog'}
  ];

  editorStyle = {
    'height': '200px',
    'background-color':'white'
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

  @Input()
  issueType: string;
  // viewModifyTaskFB:FormGroup;

  @Output()
  issueTypeO: EventEmitter<any> = new EventEmitter();


  constructor(private _formBuilder: FormBuilder,
    private _staticRefData: StaticDataService,
    private _activatedRoute: ActivatedRoute,
    private _serTaskDetails: TaskDetailsService,
    private _serNgxSpinner:NgxSpinnerService,
    private _router:Router,
    private _toastService: MessageService,
    private _serTaskLogTime:TaskLogtimeService,
    private _serUtils:UtilsService) {

      this.viewModifyTaskFB = this._formBuilder.group({
        fctlTaskId: new FormControl({ value: '', disabled: true }),
        fctlTaskNo: new FormControl({ value: '', disabled: true }),
        fctlSummary: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlDescription: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlIssueType: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlIssueStatus: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlSeverity: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlPriority: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlEnvironment: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlModuleName: new FormControl({ value: '', disabled: true }),
        fctlEstimatedTime: new FormControl({ value: '', disabled: true }),
        fctlCreatedDate: new FormControl({ value: '', disabled: true }),
        fctlCreatedBy: new FormControl({ value: '', disabled: true }),
        fctlIsBlocking: new FormControl({ value: false, disabled: true }),
        fctlModifiedDate: new FormControl({ value: '', disabled: true }),
        fctlModifiedBy: new FormControl({ value: '', disabled: true }),
        fctlReportedBy: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlReportedDate: new FormControl({ value: '', disabled: true }, Validators.required),
        fctlComment: new FormControl({ value: '', disabled: true }),
        fctlProjectName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
        fctlAssigneeName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
        fctlTabOptions: new FormControl({ value: 'Task Details'})
      });

  }


  ngOnInit(): void {
    console.log("NgOnInit");
    this.initializeModalAlertConfig();
    console.log(this._activatedRoute.snapshot.routeConfig['path']);
    this.isLoaded = false;
    this.task_no = this._activatedRoute.snapshot.paramMap.get('task_no');
    console.log('Routed Task No :'+this.task_no);
    this.viewModifyTaskFB.get('fctlTaskNo').setValue(this.task_no);
    this._serNgxSpinner.show();
    this._staticRefData.getRefTaskMaster(localStorage.getItem('currentProjectId'))
      .then(res => {
        console.log(res);
        console.log('Activated Route check');
        console.log(this.task_no);
        this.activitiesToLogTime = res.IssueStatuses;

      });
      
      this._serTaskDetails.getTaskDetails(this.task_no)
        .then(res => {
          console.log("Inside Response this._serTaskDetails.getRefMaster");
          console.log('------------')
          console.log(res);
          console.log(res['dbQryResponse']);
          console.log(res['dbQryStatus']);
          this.task_data = {
            "dbQryResponse": res['dbQryResponse'][0],
            "dbQryStatus": res['dbQryStatus']
          };
          console.log('------*******--------');
          console.log(this.task_data['dbQryResponse']);
          console.log('------@@@@@@@--------');
          console.log(this.task_data.dbQryResponse);
          this.task_data = this.task_data.dbQryResponse;
          this.task_no=this.task_data.task_no;
          this.viewModifyTaskFB.get('fctlTaskNo').setValue(this.task_data.task_no);
          this.viewModifyTaskFB.get('fctlSummary').setValue(this.task_data.summary);
          this.viewModifyTaskFB.get('fctlDescription').setValue(this.task_data.description);
          console.log('------@@@@fctlReportedDate@@@--------');
          console.log(this.viewModifyTaskFB.get('fctlReportedDate').value);
          this.isLoaded = true;
          this._serNgxSpinner.hide();
          this.viewModifyTaskFCList=this.viewModifyTaskFB.controls;
          this.setInitialDataFormValues();
          this.viewModifyTaskFB.get('fctlTabOptions').setValue('Task Details');
        });
  }

  setInitialDataFormValues(){
    this.viewModifyTaskFBState=this.viewModifyTaskFB.getRawValue();
    console.log('---------@@@@ viewModifyTaskFBInitialState @@@@-------');
    console.log(this.viewModifyTaskFBState.value);
    console.log('------------------------------------------------------');

  }

  disableAllFormControls(){
    Object.keys(this.viewModifyTaskFCList).forEach(control => {
      if (control != 'fctlTabOptions'){
        this.viewModifyTaskFB.get(control).disable();
      }
    });
    this.editorStyle["background-color"]='red';
  }

  enableAllFormControls(){
    this.editorStyle["background-color"]='white';
    Object.keys(this.viewModifyTaskFCList).forEach(control => {
      this.viewModifyTaskFB.get(control).enable();
    });
    // this.reloadComponent();
  }

  setFormBackToIntialState(){
    // this.viewModifyTaskFB.patchValue(this.viewModifyTaskFBState);
    this.reloadComponent();
  }

  updateTask() {

    this._serNgxSpinner.show();
    let formData:any;
    this.initializeModalAlertConfig();
    console.log("updateTask");
    console.log('===============================');
    console.log(this.viewModifyTaskFB.status);
    console.log(this.viewModifyTaskFB.valid);
    console.log(this.viewModifyTaskFB.getRawValue());
    console.log('===============================');

    formData={
      "task_no":this.viewModifyTaskFB.get('fctlTaskNo').value,
      "project_name":this.viewModifyTaskFB.get('fctlProjectName').value,
      "summary":this.viewModifyTaskFB.get('fctlSummary').value,
      "description":this.viewModifyTaskFB.get('fctlDescription').value,
      "severity":this.viewModifyTaskFB.get('fctlSeverity').value,
      "priority":this.viewModifyTaskFB.get('fctlPriority').value,
      "issue_type":this.viewModifyTaskFB.get('fctlIssueType').value,
      "module":this.viewModifyTaskFB.get('fctlModuleName').value,
      "is_blocking":this.viewModifyTaskFB.get('fctlIsBlocking').value? 'Y':'N',
      "issue_status":this.viewModifyTaskFB.get('fctlIssueStatus').value,
      "environment":this.viewModifyTaskFB.get('fctlEnvironment').value,
      "assignee_name":this.viewModifyTaskFB.get('fctlAssigneeName').value,
      "modified_by":localStorage.getItem('loggedInUserId'),
      "modified_date":this.viewModifyTaskFB.get('fctlCreatedDate').value,
      "reported_by": this.viewModifyTaskFB.get('fctlReportedBy').value,
      "reported_date":this.viewModifyTaskFB.get('fctlReportedDate').value,
      "estimated_time":this.viewModifyTaskFB.get('fctlEstimatedTime').value
    }
    console.log('@@------@@');
    console.log(formData);

    this.modalAlertConfig.cancelButtonLabel="";
    this.modalAlertConfig.confirmButtonLabel="Ok";
    this.modalAlertConfig.dialogConfirmed="TaskUpdateModalConfirm";
    this.modalAlertConfig.dialogCanceled="TaskUpdateModalClosed";
    this.modalAlertConfig.dialogClosed="TaskUpdateModalClosed";


    this._serTaskDetails.updateTask(formData)
        .subscribe(res=>{
          console.log("Update Task Output :"+JSON.stringify(res));
          console.log("Update Task Output :"+res['dbQryStatus']);
          console.log("Update Task Output :"+res['dbQryResponse']);

          if (res['dbQryStatus'] == 'Success'){
            this.viewModifyTaskFB.reset();
            this._serNgxSpinner.hide();

            //---
            this.modalAlertConfig.dialogConfirmed="TaskUpdateModalSuccessConfirm";
            this.modalAlertConfig.title="Task Update Success";
            this.modalAlertConfig.modalContent=formData['task_no'] + "  updated successfully";
            this.modalAlertConfig.modalType="success";
            this.modalAlertConfig.showModal=true;
            //---

          }
          else{
            this._serNgxSpinner.hide(); 
            this.modalAlertConfig.dialogConfirmed="TaskUpdateModalFailureConfirm";
            this.modalAlertConfig.title="Task Update Failed";
            this.modalAlertConfig.modalContent=formData['task_no']  + "  update failed. Contact Adminstrator.";
            this.modalAlertConfig.modalType="danger";
            this.modalAlertConfig.showModal=true;
          }

        });

    // alert("submitted");
  }

  get creTickForm() {
    return this.viewModifyTaskFB.controls;
  }

  markFormEditable() {
    console.log("Inside markFormEditable");
    let controls=this.viewModifyTaskFB.controls;
    this.enableAllFormControls();
    this.viewEditFormEditBtnEnabled=false;
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

  cancelViewEditForm(){
    console.log("Inside cancelViewEditForm()");
    console.log("======this.viewModifyTaskFB.dirty======="+this.viewModifyTaskFB.dirty+"==============");
    if (this.viewModifyTaskFB.dirty)
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
      this.viewEditFormEditBtnEnabled=true;
      this.disableAllFormControls();
    }
  }

  discardChangesOnCancel(){
      console.log("======this.leaveViewEditPageUnsaved======="+this.leaveViewEditPageUnsaved+"==============");
      console.log("Reset Back To Old values");
      console.log(this.viewModifyTaskFB.value);
      console.log(this.viewModifyTaskFBState);
      this.viewEditFormEditBtnEnabled=true;
      this.setFormBackToIntialState();
      this.disableAllFormControls();
      this.modalAlertConfig.showModal=false;
  }

  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
}

cloneTask(){
  this.clonedTaskNo="";
  this.initializeModalAlertConfig();
  let formData={
    "task_no":this.viewModifyTaskFB.get('fctlTaskNo').value,
    "created_by":localStorage.getItem('loggedInUserId')
  };

  this.modalAlertConfig.cancelButtonLabel="";
  this.modalAlertConfig.confirmButtonLabel="Ok";
  this.modalAlertConfig.dialogConfirmed="TaskCloneModalConfirm";
  this.modalAlertConfig.dialogCanceled="TaskCloneModalClosed";
  this.modalAlertConfig.dialogClosed="TaskCloneModalClosed";


  this._serNgxSpinner.show();
  this._serTaskDetails.cloneTask(formData)
  .subscribe(res=>{
    console.log("Clone Task Output :"+JSON.stringify(res));
    console.log("Clone Task Output :"+res['dbQryStatus']);
    console.log("Clone Task Output :"+res['dbQryResponse']);
      if (res['dbQryStatus'] == 'Success'){
        this.viewModifyTaskFB.reset();
        this._serNgxSpinner.hide();
        this.clonedTaskNo=res['dbQryResponse']['clonedTaskNo'];
        //---
        this.modalAlertConfig.dialogConfirmed="TaskCloneModalSuccessConfirm";
        this.modalAlertConfig.title="Task Cloned";
        this.modalAlertConfig.modalContent=formData['task_no'] + "  cloned successfully to "+ this.clonedTaskNo;
        this.modalAlertConfig.modalType="success";
        this.modalAlertConfig.showModal=true;
        //---

      }
      else{
        this._serNgxSpinner.hide(); 
        this.modalAlertConfig.dialogConfirmed="TaskCloneModalFailureConfirm";
        this.modalAlertConfig.title="Task cloning failed";
        this.modalAlertConfig.modalContent=formData['task_no']  + "  cloning failed. Contact Adminstrator.";
        this.modalAlertConfig.modalType="danger";
        this.modalAlertConfig.showModal=true;
      }
  });
}

tabSelected(e){
  console.log(this.buttonGroupOptions);
  for (let key in this.buttonGroupOptions){
    if(key == e.value)
      this.buttonGroupOptions[key]=true;
    else{
      this.buttonGroupOptions[key]=false;
    }
  }
  console.log(this.buttonGroupOptions);
  console.log(this.viewModifyTaskFB.getRawValue());
  console.log("viewModifyTaskFB.dirty:"+this.viewModifyTaskFB.dirty);
  console.log("viewModifyTaskFB.touched:"+this.viewModifyTaskFB.touched);
  console.log("viewModifyTaskFB.errors:"+this.viewModifyTaskFB.errors);
  console.log("viewModifyTaskFB.viewModifyTaskFB.valid:"+this.viewModifyTaskFB.valid);
}

showLinksModal(event){
  this.showLinkTaskModal=true;
}
disableShowLinksModal(){
  this.showLinkTaskModal=false;
  this.reloadComponent();
}

timeLoggerCancelled(){
  console.log('timeLoggerCancelled called ');
}

timeLoggerConfirmed(data){
  console.log('timeLoggerConfirmed called ');
  console.log(data);
  let adate=new Date(data['actualDate']['year'],data['actualDate']['month']-1,data['actualDate']['day']);
  console.log(adate);
  let inpData={
    task_no:this.task_no,
    activity:data['selectedActivity'],
    actual_time_spent:data['loggedTime'],
    other_activity_comment:data['otherActivity'],
    timelog_comment:data['comment'],
    time_spent_by:localStorage.getItem('loggedInUserId'),
    actual_date: adate
  }
console.log(inpData);
  this._serTaskLogTime.createTimeLog(inpData)
      .subscribe(res=>{
        console.log(res);
      });
}

modalAlertAction(param){
  console.log(param);
  console.log(this.clonedTaskNo);
  this.modalAlertConfig.showModal=false;
  this.modalAlertConfig.modalType='';
  this.modalAlertConfig.modalContent='';

  if (param === "Discard"){
    this.discardChangesOnCancel();
  }
  //-- Task Update action finished (success or failure ), reloaded component
  else if( param === "TaskUpdateModalSuccessConfirm"  || 
           param === "TaskUpdateModalFailureConfirm"  ||
           param === "TaskUpdateModalClosed" ){

      this.reloadComponent();
  }
  else if(param === "TaskCloneModalSuccessConfirm"){
    console.log('/tasks/view-edit-task/'+this.clonedTaskNo);
    this._router.navigateByUrl('/tasks/view-edit-task/'+this.clonedTaskNo);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
  }
  else if( param === "TaskCloneModalFailureConfirm"  ||
           param === "TaskCloneModalClosed" ){
    this.reloadComponent();
  }

}

}
