import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SprintDetailsService } from '../../../services/sprints/sprint-details.service'; 
import { StaticDataService  } from '../../../services/static-data.service'; 
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { faPenSquare,faPenNib,faPencilAlt,faEdit,faListUl,faNewspaper,faTh,faChartLine,faStream  } from '@fortawesome/free-solid-svg-icons';

declare var $: any;

@Component({
  selector: 'app-list-sprints',
  templateUrl: './list-sprints.component.html',
  styleUrls: ['./list-sprints.component.css']
})
export class ListSprintsComponent implements OnInit {
  faPenSquare=faPenSquare;
  faPenNib=faPenNib;
  faPencilAlt=faPencilAlt;
  faEdit=faEdit;
  faListUl=faListUl;
  faNewspaper=faNewspaper;
  faTh=faTh;
  faChartLine=faChartLine;
  faStream=faStream;

  allSprints=[];
  refSprintStatus=[];
  showTable:boolean=false;
  showCal=false;
  sprint_header_cols:string[]=[
    'Sprint Name',
    'Project Name',
    'Status',
    'Start Date',
    'End Date'
  ];
  showEditSprintDialog:boolean=false;
  modifySprintFB:FormGroup;
  errors:any={
    showErrorMessage:false,
    errorMessage:""
  };

  updateSprintData:any;
  currEditedRowData:any;

  constructor(private _serSprintDetails:SprintDetailsService,
              private _serNgxSpinner:NgxSpinnerService,
              private _formBuilder:FormBuilder,
              private _serRefStaticData:StaticDataService,
              private _router:Router) { }

  ngOnInit(): void {

    this.modifySprintFB=  this._formBuilder.group({
      fctlSprintId: new FormControl({ value: "", disabled: true }),
      fctlSprintName: new FormControl({ value: "", disabled: false }),
      fctlProjectName: new FormControl({ value: "", disabled: true }),
      fctlSprintStatus: new FormControl({ value: "", disabled: false }),
      fctlStartDate: new FormControl({ value: "", disabled: false }),
      fctlEndDate: new FormControl({ value: "", disabled: false }),
      fctlNumDevs: new FormControl({ value: "", disabled: false })
    });
  }

  ngAfterViewInit() {
    this._serSprintDetails.getAllSprintsForProject(localStorage.getItem('currentProjectName'))
        .subscribe(res=>{
            console.log("------------------ngAfterViewInit Start-------------------------");
            console.log(JSON.stringify(res));
            this.allSprints=res['dbQryResponse'];
            this.showTable=true;
            console.log("------------------ngAfterViewInit End-------------------------");
            this._serRefStaticData.getRefSprintMaster(localStorage.getItem('currentProjectId'))
                .subscribe(res =>{
                    console.log(res['dbQryResponse']['SprintStatuses']);
                    this.refSprintStatus=res['dbQryResponse']['SprintStatuses'];
                });
        });
  }

  inputClickCalled(){
    // alert('inputClickCalled');
    this.showCal=true;
  }
  onDateSelect(ev){
    alert(ev);
  }

  showSprintBoard(sprint){
    console.log(sprint);
    this._router.navigate(['boards/scrum'],{queryParams:{'sprint_id':sprint['sprint_id'],'sprint_name':sprint['sprint_name']}});
  }

  showSprintTasksDashBoard(sprint){
    console.log(sprint);
    this._router.navigate(['dashboard/sprint-tasks-dashboard'],{queryParams:{'sprint_id':sprint['sprint_id'],'sprint_name':sprint['sprint_name']}});
  }

  showSprintGanttChart(sprint){
    console.log(sprint);
    this._router.navigate(['sprints/sprint-gantt'],{queryParams:{'sprint_id':sprint['sprint_id'],'sprint_name':sprint['sprint_name']}});
  }

  editSprint(ele){
    let [sYear, sMonth, sDay]=['','',''];
    let [eYear, eMonth, eDay]=['','',''];
    if (ele['start_date'] !=null && ele['start_date'].length !=0 ){
        [sYear, sMonth, sDay] = ele['start_date'].split('-');
    }
    if (ele['end_date'] !=null && ele['end_date'].length !=0 ){
        [eYear, eMonth, eDay] = ele['end_date'].split('-');
    }
    console.log("=================");
    console.log(ele);
    let sDate=new NgbDate(parseInt(sYear),parseInt(sMonth),parseInt(sDay));
    let eDate=new NgbDate(parseInt(eYear),parseInt(eMonth),parseInt(eDay));
    console.log("=======sDate:  "+JSON.stringify(sDate));
    console.log("=======eDate:  "+JSON.stringify(eDate));
    this.showEditSprintDialog=true;
    this.modifySprintFB.get('fctlSprintName').setValue(ele['sprint_name']);
    this.modifySprintFB.get('fctlSprintStatus').setValue(ele['status']);
    this.modifySprintFB.get('fctlStartDate').setValue(sDate);
    this.modifySprintFB.get('fctlEndDate').setValue(eDate);
    this.modifySprintFB.get('fctlNumDevs').setValue(ele['num_devs']);
    this.currEditedRowData=ele;
  }
  sprintDetails(ele){
    console.log(ele);
    this._router.navigate(['sprints/edit-sprints'],{queryParams:{'sprint_id':ele['sprint_id']} }   );
  }
  modifySprint(){
    console.log("----------------modifySprint----------------");
    console.log(this.modifySprintFB.getRawValue());
  }
  showVal(e){
    console.log(e);
  }

  getModifySprintFBVals(controlName:string){
    return this.modifySprintFB.get(controlName).value;
  }
  confirmSprintEdit(){
    let startDate=this.getModifySprintFBVals('fctlEndDate');
    let endDate=this.getModifySprintFBVals('fctlStartDate');
    console.log("--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log(Date.now());
    console.log(moment(Date.now()).format('YYYY MMMM DD'));
    console.log(typeof(moment(Date.now()).format('YYYY MMMM DD')));
    // console.log(moment(Date.now()).diff("2020-03-20","days"));
    console.log(this.modifySprintFB.get('fctlStartDate').value);
    console.log(this.modifySprintFB.get('fctlEndDate').value);
    console.log(moment(this.modifySprintFB.get('fctlEndDate').value).diff(this.modifySprintFB.get('fctlStartDate').value ,"days"));

    if (moment(startDate).diff(endDate ,"days") <= 0){
      this.errors.showErrorMessage=true;
      this.errors.errorMessage="Start Date Cannot be more than End Date";
    }
    else {
      this.errors.showErrorMessage=false;
      this.allSprints['start_date']=this.modifySprintFB.get('fctlStartDate').value;
      this.allSprints['end_date']=this.modifySprintFB.get('fctlEndDate').value;
      this.showEditSprintDialog=false;
      console.log(JSON.stringify(startDate));
      console.log(moment().format("YYYY-MM-DD"));
      this.updateSprintData={
        'sprint_id': this.currEditedRowData['sprint_id'],
        'sprint_status': this.modifySprintFB.get('fctlSprintStatus').value,
        'sprint_name':this.modifySprintFB.get('fctlSprintName').value,
        'start_date':moment(this.modifySprintFB.get('fctlStartDate').value).subtract(1,'months').format('YYYY-MM-DD'),
        'end_date':moment(this.modifySprintFB.get('fctlEndDate').value).subtract(1,'months').format('YYYY-MM-DD'),
        'modified_by':localStorage.getItem("loggedInUserId"),
        'num_devs':this.modifySprintFB.get('fctlNumDevs').value
      };
      console.log("***************");
      console.log(this.updateSprintData);
      this._serSprintDetails.updateSprint(this.updateSprintData)
          .subscribe(res => {
              console.log("Response updateSprint");
              console.log(res);
              this.reloadComponent();
          });
    }
  }
  clearErrors(fieldName){
    if (fieldName == "startDate"){
      this.errors.showErrorMessage=false;
      this.errors.errorMessage="";
    }
  }
  clearData(){
    this.updateSprintData={};
    this.currEditedRowData={};
  }


  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
    this.clearErrors("startDate");
    this.clearData();

  }

}
