import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { StaticDataService } from '../../../services/static-data.service';
import { TaskDetailsService } from '../../../services/tasks/task-details.service';
import { UsersService } from '../../../services/users/users.service';
import { UtilsService } from '../../../services/shared/utils.service';

import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
// import { faCalendar} from '@fortawesome/free-solid-svg-icons';
import { faCalendar} from  '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  @Input() parentForm: FormGroup;

  dataPipe = new DatePipe('en-US');
  taskEnvRef: [any];
  taskIssueStatusesRef: [any];
  taskPrioritiesRef: [any];
  taskSeveritiesRef: [any];
  taskIssueTypesRef: [any];
  taskModuleRef: [any];
  isLoaded: boolean = false;
  task_no: string = 'NA';
  task_data: any;
  model: any;
  searching = false;
  searchFailed = false;
  userListForDropDown:any[]=[];

  retUserNameVal = [];
  retUserNameArr = [];

  faCalendar=faCalendar;
  currentDate:any;

  constructor(private _staticRefData: StaticDataService,
    private _serNgxSpinner: NgxSpinnerService,
    private _serUsers: UsersService,
    private _serTaskDetails: TaskDetailsService,
    private _serUtils: UtilsService) {

    console.log("Constructor for New Child Issue Details Component");

  }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().substring(0, 10);
  }

  ngAfterViewInit() {
    var tempDate = [];
    // New Entry
    console.log("NgOnInit Issue Details Component");
    this.isLoaded = false;

    this._serNgxSpinner.show();
    try {
      this.task_no = this.parentForm.get('fctlTaskNo').value;
    }
    catch (e) {
      console.log('@@@@@@@@@@@@@');
      console.log(e);
    }

    this._staticRefData.getRefTaskMaster(localStorage.getItem('currentProjectId'))
      .then(res => {
        console.log(res);

        this.taskEnvRef = res.Environments;
        this.taskIssueStatusesRef = res.IssueStatuses;
        this.taskIssueTypesRef = res.IssueTypes;
        this.taskPrioritiesRef = res.Priorities;
        this.taskSeveritiesRef = res.Severities;
        this.taskModuleRef = res.Modules;

        console.log("taskEnvRef:" + JSON.stringify(this.taskEnvRef));
        console.log("taskIssueStatusesRef:" + JSON.stringify(this.taskIssueStatusesRef));
        console.log("taskPrioritiesRef:" + JSON.stringify(this.taskPrioritiesRef));
        console.log("taskSeverityRef:" + JSON.stringify(this.taskSeveritiesRef));
        console.log("taskIssueTypesRef:" + JSON.stringify(this.taskIssueTypesRef));
        console.log("taskModuleRef:" + JSON.stringify(this.taskModuleRef));
        console.log('Activated Route check');
        // console.log(this._activatedRoute.snapshot.paramMap.get('task_no'));
        console.log('@@@@@ this.task_no:' + this.task_no);

        if (this.task_no !== 'NA') {
          console.log('if done @@@@@ this.task_no:' + this.task_no);

          this._serTaskDetails.getTaskDetails(this.task_no)
            .then(res => {
              console.log("Inside Response this._serTaskDetails.getRefMaster");
              console.log(res);
              console.log('------------')
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

              this.parentForm.get('fctlTaskNo').setValue(this.task_data.task_no);
              this.parentForm.get('fctlSummary').setValue(this.task_data.summary);
              this.parentForm.get('fctlDescription').setValue(this.task_data.description);
              this.parentForm.get('fctlIssueType').setValue(this.task_data.issue_type);
              this.parentForm.get('fctlIssueStatus').setValue(this.task_data.issue_status);
              this.parentForm.get('fctlSeverity').setValue(this.task_data.severity);
              this.parentForm.get('fctlPriority').setValue(this.task_data.priority);
              this.parentForm.get('fctlModuleName').setValue(this.task_data.module);
              this.parentForm.get('fctlEnvironment').setValue(this.task_data.environment);
              this.parentForm.get('fctlCreatedDate').setValue(this.task_data.created_date);
              this.parentForm.get('fctlCreatedBy').setValue(this.task_data.created_by);
              this.parentForm.get('fctlReportedDate').setValue(this.task_data.reported_date);
              this.parentForm.get('fctlReportedBy').setValue(this.task_data.reported_by);
              this.parentForm.get('fctlAssigneeName').setValue(this.task_data.assignee_name);
              this.parentForm.get('fctlIsBlocking').setValue((this.task_data.is_blocking == 'Y') ? true : false);
              this.parentForm.get('fctlEstimatedTime').setValue(this.task_data.estimated_time);

              console.log('------@@@@@@@--------');
              console.log(this.parentForm.get('fctlReportedDate').value);
              this.parentForm.get('fctlReportedDate').setValue(this._serUtils.parseDateAsYYYYMMDD(this.task_data.reported_date));
              this.isLoaded = true;
              this._serNgxSpinner.hide();
            });

        }
        else {
          //Set Defaults While Creating tasks
          // Status should be Open while creating the ticket
          console.log("------@@@@@@@@@@ In Creation of Task @@@@@@@@------");
          console.log("ticketIssueStatusesRef:" + JSON.stringify(this.taskIssueStatusesRef));
          console.log(this.currentDate);
          this.taskIssueStatusesRef.forEach(ele => {
            if (ele['name'].toUpperCase() === 'OPEN') {
              console.log("Only Open Status for Opening " + JSON.stringify(this.taskIssueStatusesRef));
              this.taskIssueStatusesRef = [{ "name": ele['name'] }];
              this.parentForm.get('fctlIssueStatus').setValue(ele['name']);
            }
          });
          this.parentForm.get('fctlReportedBy').setValue(localStorage.getItem('loggedInUserName'));
          this.parentForm.get('fctlAssigneeName').setValue(localStorage.getItem('loggedInUserName'));
          this.parentForm.get('fctlReportedDate').setValue(this._serUtils.parseDateAsYYYYMMDD(this.currentDate));
        }
      }
      );
    // New Entry end
  }

  validateEstimatedTime(inpData) {
    console.log(inpData);
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
    this.parentForm.get('fctlIssueType').setValue(issueTypeSelected);
    this.parentForm.controls.fctlIssueType.setValue(issueTypeSelected);
    // this.issueTypeO.emit(issueTypeSelected);
  }

  // markCellToEdit(e,formControl){
  //   console.log(e);
  //   console.log(formControl);
  //   this.parentForm.get(formControl).enable();
  // }

  setReportedBy(e) {
    console.log('*************************');
    console.log(e);
    console.log(this.parentForm.status);
    console.log(this.parentForm.valid);
    console.log(this.parentForm.getRawValue());
  }

  showSpinner() {
    console.log('Show Spinner Called');
    // this._serNgxSpinner.show();
    // setTimeout(()=>{
    //   this._serNgxSpinner.hide();
    // },3000)

  }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._serUsers.getUserNamesForDropDownSearch(term).pipe(
          tap((res) => {
            console.log(res);
            this.searchFailed = false
          }),
          catchError((res) => {
            this.searchFailed = true;
            console.log('***********ERROR******************');
            console.log(res);
            console.log('*****************************');
            return of([]);
          })
        ),
      ),
      map((res) => {
        this.retUserNameVal = [];
        this.retUserNameArr = res;
        // console.log(res.length);
        if (res != null) {
          res.forEach(element => {
            console.log("=*=*=*=*=*=*=*=*=*=*");
            console.log(element);
            this.retUserNameVal.push(element.name);
            console.log("=*=*=*=*=*=*=*=*=*=*");
          });
        }
        // console.log(res);
        // Array(res.name)
        return this.retUserNameVal;
      }),
      tap(() => this.searching = false)
    )

    searchUsers(event) {
      let queryRes:any[]=[];
        this._serUsers.getUserNamesForDropDownSearch(event.query)
          .subscribe(data => {
            console.log("********************");
            console.log(data);
            data.forEach(user => {
              queryRes.push(user.name);
            });
            this.userListForDropDown=queryRes;
            console.log(this.userListForDropDown);
        });
    }

  
}

