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

  ngAfterViewInit() {
    this._serTaskDetails.getAllTasks()
    .then(res=>{
      console.log("_serTaskDetails Output :"+JSON.stringify(res));
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