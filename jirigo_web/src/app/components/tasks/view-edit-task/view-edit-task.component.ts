import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { StaticDataService } from '../../../services/static-data.service';
import { TaskDetailsService } from '../../../services/tasks/task-details.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Router  } from '@angular/router';
import { faClone,faEdit, faTshirt } from '@fortawesome/free-solid-svg-icons';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-view-edit-task',
  templateUrl: './view-edit-task.component.html',
  styleUrls: ['./view-edit-task.component.css'],
  providers:[MessageService]
})
export class ViewEditTaskComponent implements OnInit {
  faClone=faClone;
  faEdit=faEdit;
  isLoaded: boolean = false;
  viewEditFormEditBtnEnabled:boolean=true;
  viewModifyTaskFB: FormGroup;
  viewModifyTaskFBState: any;
  createdDate: any;
  modifiedDate: any;
  environment: string = "Environment";
  task_data: any;
  task_no: string;
  task_issue_type:string;
  viewModifyTaskFCList;
  displayPageDirtyDialog:boolean=false;
  leaveViewEditPageUnsaved:boolean=false;


  editorStyle = {
    'height': '200px',
    'background-color':''
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
    private _toastService: MessageService) {

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
        fctlAssigneeName:new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true })

      });

  }


  ngOnInit(): void {
    console.log("NgOnInit");
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
            // this.viewModifyTaskFB.get('fctlIssueType').setValue(this.task_data.issue_type);
            // this.viewModifyTaskFB.get('fctlIssueStatus').setValue(this.task_data.issue_status);
            // this.viewModifyTaskFB.get('fctlSeverity').setValue(this.task_data.severity);
            // this.viewModifyTaskFB.get('fctlPriority').setValue(this.task_data.priority);
            // this.viewModifyTaskFB.get('fctlEnvironment').setValue(this.task_data.environment);
            // this.viewModifyTaskFB.get('fctlCreatedDate').setValue(this.task_data.created_date);
            // this.viewModifyTaskFB.get('fctlCreatedBy').setValue(this.task_data.created_by);
            // this.viewModifyTaskFB.get('fctlReportedDate').setValue(this.task_data.reported_date);
            // this.viewModifyTaskFB.get('fctlReportedBy').setValue(this.task_data.reported_by);
            // this.viewModifyTaskFB.get('fctlAssigneeName').setValue(this.task_data.assignee_name);
            console.log('------@@@@fctlReportedDate@@@--------');
            console.log(this.viewModifyTaskFB.get('fctlReportedDate').value);
            this.isLoaded = true;
            this._serNgxSpinner.hide();
            this.viewModifyTaskFCList=this.viewModifyTaskFB.controls;
            this.setInitialDataFormValues();
          });
      }
      );
  }

  setInitialDataFormValues(){
    this.viewModifyTaskFBState=this.viewModifyTaskFB.getRawValue();
    console.log('---------@@@@ viewModifyTaskFBInitialState @@@@-------');
    console.log(this.viewModifyTaskFBState.value);
    console.log('------------------------------------------------------');

  }
  disableAllFormControls(){
    Object.keys(this.viewModifyTaskFCList).forEach(control => {
      this.viewModifyTaskFB.get(control).disable();
    });
    this.editorStyle["background-color"]='';
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
    let formData:any;

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

    this._serTaskDetails.updateTask(formData)
        .subscribe(res=>{
          console.log("Update Task Output :"+JSON.stringify(res));
          console.log("Update Task Output :"+res['dbQryStatus']);
          console.log("Update Task Output :"+res['dbQryResponse']);
          if (res['dbQryStatus'] == 'Success'){
            this._serNgxSpinner.show();
            this.viewModifyTaskFB.reset();
            // alert("Task Updated Successfully.");
            this.reloadComponent();
            this._serNgxSpinner.hide();

          }
          else{
            alert('Task Updation Unsuccessful');
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


  cancelViewEditForm(){
    console.log("Inside cancelViewEditForm()");
    console.log("======this.viewModifyTaskFB.dirty======="+this.viewModifyTaskFB.dirty+"==============");
    if (this.viewModifyTaskFB.dirty)
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
      console.log(this.viewModifyTaskFB.value);
      console.log(this.viewModifyTaskFBState);
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

cloneTask(){
  let formData={
    "task_no":this.viewModifyTaskFB.get('fctlTaskNo').value,
    "created_by":localStorage.getItem('loggedInUserId')
  }
  this._serNgxSpinner.show();
  this._serTaskDetails.cloneTask(formData)
  .subscribe(res=>{
    console.log("Clone Task Output :"+JSON.stringify(res));
    console.log("Clone Task Output :"+res['dbQryStatus']);
    console.log("Clone Task Output :"+res['dbQryResponse']);
    if (res['dbQryStatus'] == 'Success'){
      this._serNgxSpinner.show();
      this.viewModifyTaskFB.reset();
        this._serNgxSpinner.hide();
        this._toastService.add({severity:'success', 
        summary:'New Task Number : '+res['dbQryResponse']['taskNo'], 
        detail:'Task Cloning Successful'
        });
       setTimeout(() => {
         this.reloadComponent();
       }, 4000);
    }
    else{
      this._toastService.add({severity:'error', 
      summary:'Task Cloning Unsuccessful', 
      detail:'Clone Failure'
      });
    }
  });
}

}
