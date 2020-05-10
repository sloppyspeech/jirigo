import { Component, OnInit,ViewChild } from '@angular/core';
import { ProjectsService  } from '../../../services/projects/projects.service';
import { Router  } from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';


@Component({
  selector: 'app-change-project',
  templateUrl: './change-project.component.html',
  styleUrls: ['./change-project.component.css'],
  exportAs:'changeProjectModal'
})
export class ChangeProjectComponent implements OnInit {
  
  showProjectChange:boolean=false;
  currentProject='';
  projectHeaderCols=[
    // {'header':'Project Id','field':'project_id'},
    {'header':'Project Name','field':'project_name'},
    {'header':'Project Abbr','field':'project_abbr'},
    {'header':'Default Project','field':'default_project'}
  ];
  projectDetails:any[]=[];
  selectedProject:any;

  constructor(private _router:Router,
              private _serProjects:ProjectsService,
              private _serNgxSpinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.showProjectChange=true;
    this.currentProject=localStorage.getItem('currentProjectName');
    this._serProjects.getAllProjectsForUser(localStorage.getItem('loggedInUserId'))
        .subscribe(res=>{
            console.log(res);
            res['dbQryResponse'].forEach(project => {
              this.projectDetails.push(project);
            });
            console.log(this.projectDetails);
        });
  }


 setRowData(rowData){
   console.log(rowData);
   this.selectedProject=rowData;
   console.log(this.selectedProject);
 }


 confirmChangeProject(){
  console.log("confirmChangeProject");
  localStorage.setItem('currentProjectId',this.selectedProject['project_id']);
  localStorage.setItem('currentProjectName',this.selectedProject['project_name']);
  this.showProjectChange=false;
  this._serNgxSpinner.show();
  setTimeout(() => {
    this._serNgxSpinner.hide();
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    window.location.reload();
    this._router.navigate(['/list-projects']);
  }, 2000);
 }

}
