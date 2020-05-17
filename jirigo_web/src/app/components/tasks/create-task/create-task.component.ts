import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,AbstractControl,ValidatorFn } from '@angular/forms';
import { StaticDataService } from '../../../services/static-data.service';
import { TaskDetailsService } from '../../../services/tasks/task-details.service';
import { UsersService } from '../../../services/users/users.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  createTaskFB: FormGroup;
  createdDate: any;
  modifiedDate: any;
  environment: string = "Environment";
  taskEnvRef: [any];
  taskIssueStatusesRef: [any];
  taskPrioritiesRef: [any];
  taskSeveritiesRef: [any];
  taskIssueTypesRef: [any];

  editorStyle = {
    'height': '200px'
    // ,'background-color':'#EAF4FC'
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }]
    ]
  };

  @Input()
  issueType: string;

  @Output()
  issueTypeO: EventEmitter<any> = new EventEmitter();


  constructor(private _formBuilder: FormBuilder,
    private _staticRefData: StaticDataService,
    private _calendar: NgbCalendar,
    private _NgxSpinner: NgxSpinnerService,
    private _serTaskDetails: TaskDetailsService,
    private _serUsers: UsersService,
    private _router: Router) {

    this._NgxSpinner.show();
    console.log("Calling the New Ref Master");

    this._staticRefData.getRefTaskMaster(localStorage.getItem('currentProjectId'))
      .then(res => {
        console.log(res);
        this.taskEnvRef = res.Environments;
        this.taskIssueStatusesRef = res.IssueStatuses;
        this.taskIssueTypesRef = res.IssueTypes;
        this.taskPrioritiesRef = res.Priorities;
        this.taskSeveritiesRef = res.Severities;
        console.log("here:" + JSON.stringify(this.taskEnvRef));
        console.log("taskIssueStatusesRef:" + JSON.stringify(this.taskIssueStatusesRef));
        console.log("taskPrioritiesRef:" + JSON.stringify(this.taskPrioritiesRef));
        console.log("taskSeverityRef:" + JSON.stringify(this.taskSeveritiesRef));
        console.log("taskIssueTypesRef:" + JSON.stringify(this.taskIssueTypesRef));
        setTimeout(() => {
          this._NgxSpinner.hide();
        }, 1500)
      });

    this.issueTypeO = new EventEmitter;
    console.log("Create Task NgOnInit");

    this.createTaskFB = this._formBuilder.group({
      fctlProjectName: new FormControl({ value: localStorage.getItem('currentProjectName'), disabled: true }),
      fctlSummary: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlDescription: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlIssueType: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlIssueStatus: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlSeverity: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlPriority: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlModuleName: new FormControl({ value: '', disabled: false }),
      fctlEnvironment: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlCreatedDate: new FormControl({ value: this._calendar.getToday(), disabled: true }),
      fctlCreatedBy: new FormControl({ value: '', disabled: false }),
      fctlIsBlocking: new FormControl({ value: false, disabled: false }),
      fctlModifiedDate: new FormControl({ value: '', disabled: true }),
      fctlModifiedBy: new FormControl({ value: '', disabled: true }),
      fctlReportedBy: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlReportedDate: new FormControl({ value: '', disabled: false }, Validators.required),
      fctlComment: new FormControl({ value: '', disabled: true }),
      fctlAssigneeName: new FormControl({ value: '', disabled: false }),
      fctlEstimatedTime: new FormControl({ value: 0, disabled: false })
    });
  }


  ngOnInit(): void {
  }

  validateEstimatedTime(estimatedTime:AbstractControl):{ [key: string]: boolean }|null{
    console.log("validateEstimatedTime");
    if (estimatedTime.value %0.5 === 0 ){
      console.log("no Error esti");
    }
    else{
      console.log("Error esti");
    }
    return estimatedTime.value %0.5 === 0 ? null :{estimatedTimeIncorrect:true};
  }

  onSubmit() {
    let formData: any;
    console.log("Here in On Submit Create task component");
    console.log(this.createTaskFB.status);
    console.log(this.createTaskFB.valid);
    console.log('===============================');
    console.log(this.createTaskFB.getRawValue());
    console.log('===============================');

    formData = {
      "project_name": this.createTaskFB.get('fctlProjectName').value,
      "summary": this.createTaskFB.get('fctlSummary').value,
      "description": this.createTaskFB.get('fctlDescription').value,
      "severity": this.createTaskFB.get('fctlSeverity').value,
      "priority": this.createTaskFB.get('fctlPriority').value,
      "module": this.createTaskFB.get('fctlModuleName').value,
      "issue_type": this.createTaskFB.get('fctlIssueType').value,
      "issue_status": this.createTaskFB.get('fctlIssueStatus').value,
      "is_blocking": this.createTaskFB.get('fctlIsBlocking').value ? 'Y' : 'N',
      "environment": this.createTaskFB.get('fctlEnvironment').value,
      "assignee_name": this.createTaskFB.get('fctlAssigneeName').value,
      "created_by": localStorage.getItem('loggedInUserId'),
      "created_date": this.createTaskFB.get('fctlCreatedDate').value,
      "reported_by": this.createTaskFB.get('fctlReportedBy').value,
      "reported_date": this.createTaskFB.get('fctlReportedDate').value,
      "module_name": this.createTaskFB.get('fctlModuleName').value,
      "estimated_time": this.createTaskFB.get('fctlEstimatedTime').value
    }
    console.log('@@------@@');
    console.log(formData);
    this._NgxSpinner.show();
    this._serTaskDetails.creTask(formData)
      .subscribe(res => {
        console.log("Create Task Output :" + JSON.stringify(res));
        console.log("Create Task Output :" + res['dbQryStatus']);
        console.log("Create Task Output :" + res['dbQryResponse']);
        if (res['dbQryStatus'] == 'Success') {
          this.createTaskFB.reset();
          alert(res['dbQryResponse']['taskNo']+" Created Successfully.");
          this._NgxSpinner.hide();
        }
        else {
          alert('Task Creation Unsuccessful');
        }
      })

    // alert("submitted");
  }

  get creTickForm() {
    return this.createTaskFB.controls;
  }

  setEnvironment1(e) {
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e.target.value);
    // console.log(envSelected);
    // this.createTaskFB.controls.fctlIssueType.setValue(envSelected);

  }

  setEnvironment(e, f) {
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e);
    // console.log(envSelected);
    // this.createTaskFB.controls.fctlIssueType.setValue(envSelected);

  }
  setIssueType(e, issueTypeSelected) {
    // alert("Alert Called");
    console.log("setIssueType Called");
    console.log(issueTypeSelected);
    this.createTaskFB.get('fctlIssueType').setValue(issueTypeSelected);
    this.createTaskFB.controls.fctlIssueType.setValue(issueTypeSelected);
    // this.issueTypeO.emit(issueTypeSelected);
  }

  // markCellToEdit(e, formControl) {
  //   console.log(e);
  //   console.log(formControl);
  //   this.createTaskFB.get(formControl).enable();
  // }

  showSpinner() {
    console.log('Show Spinner Called');
    this._NgxSpinner.show();
    setTimeout(() => {
      this._NgxSpinner.hide();
    }, 3000)
  }

  cancelForm() {
    if (this.createTaskFB.dirty) {
      alert('Task Creation Has Unsaved Data');
    }
    this.createTaskFB.reset();
  }




}
