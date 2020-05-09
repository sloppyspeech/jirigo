import { Component, OnInit } from '@angular/core';
import { ProjectsService  } from '../../../services/projects/projects.service';
import { DialogService  } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-change-project',
  templateUrl: './change-project.component.html',
  styleUrls: ['./change-project.component.css']
})
export class ChangeProjectComponent implements OnInit {
  showProjectChange:boolean=false;
  projectHeaderCols=[
    // {'header':'Project Id','field':'project_id'},
    {'header':'Project Name','field':'project_name'},
    {'header':'Project Abbr','field':'project_abbr'},
    {'header':'Default Project','field':'default_project'}
  ];
  projectDetails:any[]=[];
  selectedProject:any;

  constructor(
              private _serProjects:ProjectsService) { }

  ngOnInit(): void {
    this.showProjectChange=true;
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
  localStorage.setItem('currentProjectId',this.selectedProject['project_id']);
  localStorage.setItem('currentProjectName',this.selectedProject['project_name']);
  this.showProjectChange=false;
 }

}
