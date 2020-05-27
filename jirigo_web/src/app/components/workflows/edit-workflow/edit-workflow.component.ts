import { Component, OnInit } from '@angular/core';
import { RolesService } from './../../../services/roles/roles.service';
import { ProjectsService } from './../../../services/projects/projects.service';

@Component({
  selector: 'app-edit-workflow',
  templateUrl: './edit-workflow.component.html',
  styleUrls: ['./edit-workflow.component.css']
})
export class EditWorkflowComponent implements OnInit {
  allProjects:any[]=[];
  allRolesForSelectedProject:any[]=[];
  selectedProjectId:number=-1;
  
  constructor(private _serProjects:ProjectsService,
              private _serRoles:RolesService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadProjects(){
    this._serProjects.getAllProjects()
        .subscribe(res=>{
          res['dbQryResponse'].forEach(ele => {
              this.allProjects.push({'project_id':ele['project_id'],'project_name':ele['project_name']});
          });
          console.log(this.allProjects);
        });
  }

  loadRoles(){
    this.allRolesForSelectedProject=[];
    this._serRoles.getRolesActiveForAllProjects()
        .subscribe(res=>{
            console.log(res);
            res['dbQryResponse'].foreach(ele=>{
              if (ele['project_id'] == this.selectedProjectId){
                this.allRolesForSelectedProject.push({'role_id':ele['role_id'],'role_name':ele['role_name']});
              }
            })
        });
  }

}
