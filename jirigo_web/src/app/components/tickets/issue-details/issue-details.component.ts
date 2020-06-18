import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { StaticDataService } from '../../../services/static-data.service';
import { TicketDetailsService } from '../../../services/tickets/ticket-details.service';
import { UsersService } from '../../../services/users/users.service';
import { UtilsService } from '../../../services/shared/utils.service';
import {faCalendarCheck,faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt} from '@fortawesome/free-regular-svg-icons';
import { NgxSpinnerService } from "ngx-spinner";

import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-issue-details',
  templateUrl: './issue-details.component.html',
  styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {
  @Input() parentForm: FormGroup;

  faCalendar=faCalendar;
  faCalendarCheck=faCalendarCheck;
  faCalendarAlt=faCalendarAlt;

  dataPipe = new DatePipe('en-US');
  ticketEnvRef: [any];
  ticketIssueStatusesRef: [any];
  ticketPrioritiesRef: [any];
  ticketSeveritiesRef: [any];
  ticketIssueTypesRef: [any];
  ticketModuleRef: [any];
  ticketChannelsRef:[any];
  isLoaded: boolean = false;
  ticket_no: string = 'NA';
  ticket_data: any;
  model: any;
  searching = false;
  searchFailed = false;
  userListForDropDown:any[]=[];

  retUserNameVal = [];
  retUserNameArr = [];

  currentDate:any;

  constructor(private _staticRefData: StaticDataService,
    private _serNgxSpinner: NgxSpinnerService,
    private _serUsers: UsersService,
    private _serTicketDetails: TicketDetailsService,
    private _serUtils: UtilsService) {

    console.log("Constructor for New Child Issue Details Component");

  }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().substring(0, 10);
    var tempDate = [];
    // New Entry
    console.log("NgOnInit Issue Details Component");
    this.isLoaded = false;

    this._serNgxSpinner.show();

    /// check if its Creation or Modification of ticket
    try {
      this.ticket_no = this.parentForm.get('fctlTicketNo').value;
    }
    catch (e) {
      console.log('No Ticket No Exists , its ticket Modification action :'+e);
      this.ticket_no = 'NA';
    }

    this._staticRefData.getRefTicketMaster(localStorage.getItem('currentProjectId'))
      .then(res => {
        console.log(res);
        
        this.ticketEnvRef = res.Environments;
        this.ticketIssueStatusesRef = res.IssueStatuses;
        this.ticketIssueTypesRef = res.IssueTypes;
        this.ticketModuleRef = res.Modules;
        this.ticketPrioritiesRef = res.Priorities;
        this.ticketSeveritiesRef = res.Severities;
        this.ticketChannelsRef = res.Channels;

        console.log("here:" + JSON.stringify(this.ticketEnvRef));
        console.log("ticketIssueStatusesRef:" + JSON.stringify(this.ticketIssueStatusesRef));
        console.log("ticketPrioritiesRef:" + JSON.stringify(this.ticketPrioritiesRef));
        console.log("ticketSeverityRef:" + JSON.stringify(this.ticketSeveritiesRef));
        console.log("ticketIssueTypesRef:" + JSON.stringify(this.ticketIssueTypesRef));
        console.log("ticketModuleRef:" + JSON.stringify(this.ticketModuleRef));
        console.log('Activated Route check');
        // console.log(this._activatedRoute.snapshot.paramMap.get('ticket_no'));
        console.log('@@@@@ this.ticket_no:' + this.ticket_no);

        // Modification of a ticket
        if (this.ticket_no !== 'NA') {
          console.log('In Modifiction of Ticket this.ticket_no:' + this.ticket_no);

          this._serTicketDetails.getTicketDetails(this.ticket_no)
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
              console.log('------@@@@@@@--------');
              console.log(this.ticket_data['dbQryResponse']);
              console.log('------@@@@@@@--------');
              console.log(this.ticket_data.dbQryResponse);
              this.ticket_data = this.ticket_data.dbQryResponse;

              this.parentForm.get('fctlTicketNo').setValue(this.ticket_data.ticket_no);
              this.parentForm.get('fctlSummary').setValue(this.ticket_data.summary);
              this.parentForm.get('fctlDescription').setValue(this.ticket_data.description);
              this.parentForm.get('fctlIssueType').setValue(this.ticket_data.issue_type);
              this.parentForm.get('fctlIssueStatus').setValue(this.ticket_data.issue_status);
              this.parentForm.get('fctlSeverity').setValue(this.ticket_data.severity);
              this.parentForm.get('fctlPriority').setValue(this.ticket_data.priority);
              this.parentForm.get('fctlModule').setValue(this.ticket_data.module);
              this.parentForm.get('fctlEnvironment').setValue(this.ticket_data.environment);
              this.parentForm.get('fctlCreatedDate').setValue(this.ticket_data.created_date);
              this.parentForm.get('fctlCreatedBy').setValue(this.ticket_data.created_by);
              this.parentForm.get('fctlModifiedDate').setValue(this.ticket_data.modified_date);
              this.parentForm.get('fctlModifiedBy').setValue(this.ticket_data.modified_by);
              this.parentForm.get('fctlReportedDate').setValue(this.ticket_data.reported_date);
              this.parentForm.get('fctlReportedBy').setValue(this.ticket_data.reported_by);
              this.parentForm.get('fctlAssigneeName').setValue(this.ticket_data.assignee_name);
              this.parentForm.get('fctlChannel').setValue(this.ticket_data.channel);
              this.parentForm.get('fctlIsBlocking').setValue((this.ticket_data.is_blocking == 'Y') ? true : false);
              console.log('------@@@@@@@--------');
              console.log(this.parentForm.get('fctlReportedDate').value);
              this.parentForm.get('fctlReportedDate').setValue(this._serUtils.parseDateAsYYYYMMDD(this.ticket_data.reported_date));
              this.isLoaded = true;
              this._serNgxSpinner.hide();
            });

        }
        else {
          // Status should be Open while creating the ticket
          console.log("------@@@@@@@@@@ In Creation of Ticket @@@@@@@@------");
          console.log("ticketIssueStatusesRef:" + JSON.stringify(this.ticketIssueStatusesRef));
          this.ticketIssueStatusesRef.forEach(ele => {
            if (ele['name'].toUpperCase() === 'OPEN') {
              this.ticketIssueStatusesRef = [{ "name": ele['name'] }];
              this.parentForm.get('fctlIssueStatus').setValue(ele['name']);
              console.log("Only Open Status for Opening " + JSON.stringify(this.ticketIssueStatusesRef));
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

  setEnvironment1(e) {
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e.target.value);
    // console.log(envSelected);
    // this.createTicketFB.controls.fctlIssueType.setValue(envSelected);

  }

  setEnvironment(e, f) {
    // alert("Alert Called");
    // console.log("Set Environment Called");
    console.log(e);
    // console.log(envSelected);
    // this.createTicketFB.controls.fctlIssueType.setValue(envSelected);

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
