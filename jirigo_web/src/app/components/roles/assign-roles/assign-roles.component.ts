import { Component, OnInit } from '@angular/core';
import { RolesService } from './../../../services/roles/roles.service';
import { faPlusSquare,faTrashAlt,faEdit} from  '@fortawesome/free-regular-svg-icons'
import { faSitemap} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup,FormControl,Validators} from '@angular/forms';
import { ProjectsService} from '../../../services/projects/projects.service';
import { ProjectWorkflowsService } from './../../../services/workflows/project-workflows.service';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.css']
})
export class AssignRolesComponent implements OnInit {
  allActiveRolesForProjects:any[]=[];
  allActiveRoles:any[]=[];
  allActiveProjects:any[]=[];
  allUnallocatedWorkflowsForRoles:any[]=[];

  faPlusSquare=faPlusSquare;
  faTrashAlt=faTrashAlt;
  faEdit=faEdit;
  faSitemap=faSitemap;

  assignRoleToProjFG:FormGroup;
  assignWorkflowToRoleFG:FormGroup;

  constructor(private _serRoles:RolesService,
              private _serFormBuilder:FormBuilder,
              private _serProjects:ProjectsService,
              private _serProjectWorkflows:ProjectWorkflowsService
    ) { 
      
      this.assignRoleToProjFG=this._serFormBuilder.group({
        'fctlRoleName':new FormControl ({ value: '', }, [Validators.required]),
        'fctlProjectName':new FormControl ({ value: '', }, [Validators.required]),
        'fctlRoleIsActive':new FormControl ({ value: '', }, [Validators.required])
      });

      this.assignWorkflowToRoleFG=this._serFormBuilder.group({
        'fctlWfToRoleName':new FormControl ({ value: '', disabled:true}, [Validators.required]),
        'fctlWfToRoleId':new FormControl ({ value: '', }, [Validators.required]),
        'fctlWfToProjectName':new FormControl ({ value: '', disabled:true}, [Validators.required]),
        'fctlWfToProjectId':new FormControl ({ value: '', }, [Validators.required]),
        'fctlWfToWorkflowId':new FormControl ({ value: 0, }, [Validators.required])
      });

    }

  ngOnInit(): void {
    this.getRolesActiveForallProjects();

    this._serRoles.getActiveRoles()
        .subscribe(res=>{
          console.log('=======getActiveRoles=========');
          this.allActiveRoles=res['dbQryResponse'];
          console.log(this.allActiveRoles);
          
          this._serProjects.getAllProjects()
          .subscribe(res=>{
            console.log('=======getAllProjects=========');
            this.allActiveProjects=res['dbQryResponse'];
            console.log(this.allActiveProjects);
          });


        });
    


  }

  getRolesActiveForallProjects(){
    this._serRoles.getRolesActiveForAllProjects()
        .subscribe(res=>{
            console.log(res);
            this.allActiveRolesForProjects=res['dbQryResponse'];
        });
  }

  removeRoleFromProject(inpData){
    console.log("-------removeRoleFromProject------");
    console.log(inpData);
    this._serRoles.removeRoleFromProject(inpData)
        .subscribe(res=>{
          console.log(res);
          this.getRolesActiveForallProjects();
        })
  }

  reset(){
    this.assignRoleToProjFG.reset();
  }

  addRoleToProject(){
    let inpData={
      project_id:this.assignRoleToProjFG.get('fctlProjectName').value,
      role_id:this.assignRoleToProjFG.get('fctlRoleName').value,
      created_by:localStorage.getItem('loggedInUserId')
    };
    console.log('---------addRoleToProject---------')
    console.log(inpData);
    this._serRoles.addRoleToProject(inpData)
        .subscribe(res=>{
          console.log(res);
          this.getRolesActiveForallProjects();
        });

  }

  getWorkflowDetails(r){
    this.allUnallocatedWorkflowsForRoles=[];
    this.assignWorkflowToRoleFG.get('fctlWfToWorkflowId').setValue(0);
    let inpData={
      'project_id':r['project_id'],
      'role_id':r['role_id']
    };
    console.log(r);
    this.assignWorkflowToRoleFG.get('fctlWfToRoleName').setValue(r['role_name']);
    this.assignWorkflowToRoleFG.get('fctlWfToRoleId').setValue(r['role_id']);
    this.assignWorkflowToRoleFG.get('fctlWfToProjectName').setValue(r['project_name']);
    this.assignWorkflowToRoleFG.get('fctlWfToProjectId').setValue(r['project_id']);

    this._serProjectWorkflows.getUnAllocatedWorkflowsOfProjects(inpData)
        .subscribe(res=>{
          console.log(res);
          if (res['dbQryResponse']){
            console.log('Has Values');
            res['dbQryResponse'].forEach(ele => {
                this.allUnallocatedWorkflowsForRoles.push({'workflow_id':ele['workflow_id'],'workflow_name':ele['workflow_name']});
            });
          }
          else{
            console.log('NULL VALUES');
          }
        });
  }

  assignWorkflowToRole(){
    let inpData={
      'project_id':this.assignWorkflowToRoleFG.get('fctlWfToProjectId').value,
      'role_id':this.assignWorkflowToRoleFG.get('fctlWfToRoleId').value,
      'workflow_id':this.assignWorkflowToRoleFG.get('fctlWfToWorkflowId').value,
      'created_by':localStorage.getItem('loggedInUserId')
    }
    console.log(this.assignWorkflowToRoleFG.getRawValue());

    this._serRoles.assignWorkflowToRole(inpData)
        .subscribe(res=>{
          console.log(res);
        });

  }
  resetWofklowAllocation(){
      this.assignWorkflowToRoleFG.reset();
  }
}
