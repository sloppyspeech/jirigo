import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';
import { TaskDetailsService  } from '../../../services/tasks/task-details.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css']
})
export class ListTasksComponent implements OnInit {
  allTasks=[];
  showTable:boolean=false;
  taskDetailsCols=[
    {'header':'Task No','field':'task_no','width':'8%'},
    {'header':'Summary','field':'summary','width':'28%'},
    {'header':'Status','field':'issue_status','width':'9%'},
    {'header':'Type','field':'issue_type','width':'9%'},
    {'header':'Severity','field':'severity','width':'8%'},
    {'header':'Priority','field':'priority','width':'8%'},
    // {'header':'Environment','field':'environment','width':'7%'},
    // {'header':'Estimation (hrs)','field':'estimated_time','width':'7%'},
    {'header':'Reported By','field':'reported_by','width':'10%'},
    {'header':'Reported Date','field':'reported_date','width':'12%'},
    {'header':'Assigned To','field':'assigned_to','width':'10%'}
  ];
  ctxItems=[];
  ctxSelectedRow:any;
  task_header_cols:string[]=[
    // 'task_int_id',
    'Task No',
    'Summary',
    'Issue Status',
    'Issue Type',
    'Severity',
    'Priority',
    'Environment',
    // 'Blocking',
    'Reported By',
    'Reported Date'
    // ,
    // 'Created By',
    // 'Created Date',
    // 'Modified By',
    // 'Modified Date'
  ];
  
  dtOptions: DataTables.Settings = {};
// dtOptions: DataTables.Settings = {
//   "columnDefs": [
//     { "orderable": false, "targets": 0 },
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null
//   ],
//   "columns": [
//     { "orderable": false,"width":"80%" },
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null,
//     null
//   ]
// };
  constructor(private _router:Router,
              private _serTaskDetails:TaskDetailsService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.ctxItems = [
      { label: 'Assign To Me', icon: 'pi pi-check', command: (event) => this.assignToggle(this.ctxSelectedRow,'assign') },
      { label: 'Unassign Task', icon: 'pi pi-minus-circle', command: (event) => this.assignToggle(this.ctxSelectedRow,'unassign') }
  ];
    this.allTasks=[];
    this.showTable=false;
    // this._serNgxSpinner.show();
    this.dtOptions = {
      // pagingType: 'full_numbers',
      pageLength: 10,
      // paging: false,
      // scrollY: "400",
      responsive: true  
    };


  }
  
  assignToggle(dataRow,action){
    console.log(dataRow);
    let inpData={};
    let assignee_id='';
    if (action=='assign'){
      inpData={
        'task_no':dataRow['task_no'],
        'assignee_id':localStorage.getItem('loggedInUserId'),
        'modified_by':localStorage.getItem('loggedInUserId')
      }
    }
    else{
      inpData={
        'task_no':dataRow['task_no'],
        'modified_by':localStorage.getItem('loggedInUserId')
      }
    }

    console.log(dataRow);
    console.log(action);
    console.log(inpData);
    this._serTaskDetails.updateTaskAssignee(inpData)
        .subscribe(res=>{
          console.log(res);
          if(res['dbQryStatus'] == "Success"){
            alert('Action Successful');
            this.reloadComponent();
          }
        });
  }
  reloadComponent() {
    console.log("===============reloadComponent=================");
    console.log(this._router.url);
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate([this._router.url]);
}
  ngAfterViewInit() {
    this._serTaskDetails.getAllTasks()
    .then(res=>{
      // console.log("_serTaskDetails Output :"+JSON.stringify(res));
      console.log("===================");
      console.log(res['dbQryResponse']);
      console.log("===================");
      // this.allTasks['dbQryResponse']=res['dbQryResponse'];
      for (var i=0;i<res['dbQryResponse'].length;i++){
        this.allTasks.push(res['dbQryResponse'][i]);
      }
      // this.allTasks=res['dbQryResponse'];
      console.log(this.allTasks);
      this.showTable=true;
      // setTimeout(() => {
      //   this._serNgxSpinner.hide();
      //   // $(()=>{
      //   //   $('#testTask').html("List Tasks");
      //   // });
      // }, 1000);

    },err=>{
      console.log('Error while retrieving task Data from DB:'+JSON.stringify(err));
    })
    .catch(e=>{
        console.log("Error Fetching all tasks getAllTasks in list-tasks-components:"+e);
    });
  }
  cellToEdit(e,val){
    alert(val);
  }
  cellToDblEdit(e,val){
    alert(val);
  }

  gotoHeroes(inp) {
    // let heroId = hero ? hero.id : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this._router.navigate(['/view-edit-tasks', { id: "heroId", foo: 'foo' }]);
  }


}
