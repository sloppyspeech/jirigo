import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,ParamMap  } from '@angular/router';
import { ProjectsService  } from '../../../services/projects/projects.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  allProjects=[];
  showTable:boolean=false;
  project_list_header_cols:string[]=[
    'Project Name',
    'Abbreviation',
    'Project Type',
  ];
  constructor(private _router:Router,
              private _serProjectDetails:ProjectsService,
              private _serNgxSpinner:NgxSpinnerService){ }

  ngOnInit(): void {
    this.allProjects=[];

  }
  ngAfterViewInit() {
    this.allProjects=[];
    this._serProjectDetails.getAllProjects()
    .subscribe(res=>{
      console.log("_serProjectDetails Output :"+JSON.stringify(res));
      console.log("===================");
      console.log(res['dbQryStatus']);
      console.log(res['dbQryResponse']);
      console.log("===================");
      // this.allProjects['dbQryResponse']=res['dbQryResponse'];
      for (var i=0;i<res['dbQryResponse'].length;i++){
        this.allProjects.push(res['dbQryResponse'][i]);
      }
      // this.allProjects=res['dbQryResponse'];
      this.showTable=true;
      // setTimeout(() => {
      //   this._serNgxSpinner.hide();
      //   // $(()=>{
      //   //   $('#testTicket').html("List Tickets");
      //   // });
      // }, 1000);

    }
    );
    
  }

}
