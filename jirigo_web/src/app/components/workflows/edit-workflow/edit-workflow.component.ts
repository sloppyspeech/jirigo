import { Component, OnInit } from '@angular/core';
import { RolesService } from './../../../services/roles/roles.service';
import { ProjectsService } from './../../../services/projects/projects.service';
import { ProjectWorkflowsService } from './../../../services/workflows/project-workflows.service';
import { faLongArrowAltRight,faArrowDown,faArrowRight,faInfoCircle,faInfo} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-workflow',
  templateUrl: './edit-workflow.component.html',
  styleUrls: ['./edit-workflow.component.css']
})
export class EditWorkflowComponent implements OnInit {
  faArrowRight=faArrowRight;
  faArrowDown=faArrowDown;
  faInfo=faInfo;
  faInfoCircle=faInfoCircle;
  
  statusGrid:Array< {
    status:string ,
    nextStatuses:Array<{
                        name:string,
                        allowed:boolean
                      }> 
                  }>=[];

  allProjects:any[]=[];
  allRoles:any[]=[];
  allRolesForSelectedProject:any[]=[];
  allWorkflowsForProjectAndRole:any[]=[];

  fProjectId:number=-1;
  fRoleId:number=-1;
  fWorkflowId:number=-1;
  enableRoleDropdown:boolean=false;
  enableWFDropdown:boolean=false;
  
  constructor(private _serProjects:ProjectsService,
              private _serRoles:RolesService,
              private _serProjectWorkflow:ProjectWorkflowsService) { }

  ngOnInit(): void {
    this.enableRoleDropdown=false;
    this.enableWFDropdown=false;

    this.loadProjects();
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
            this.allRoles=res['dbQryResponse'];
        });
  }

  populateRolesDD(e){
    this.allRolesForSelectedProject=[];
    this.enableRoleDropdown=false;
    console.log("------------------");
    console.log(e.target.value);
    this.allRoles.forEach(ele =>{
      console.log(ele);
      console.log(ele['project_id'] +":"+ this.fProjectId);
        if (ele['project_id'] == this.fProjectId){
          this.allRolesForSelectedProject.push({'role_id':ele['role_id'],'role_name':ele['role_name']});
          this.enableRoleDropdown=true;
        }
        console.log(this.allRolesForSelectedProject)
    });
  }

  populateWorkflowDD(){
    this.enableWFDropdown=false;
    this.allWorkflowsForProjectAndRole=[];
    console.log(this.fRoleId +":"+this.fProjectId);
    this._serProjectWorkflow.getProjectRoleWorkflowListForUpdate()
        .subscribe(res=>{
          res['dbQryResponse'].forEach(ele => {
            console.log(ele);
              if(ele['role_id'] == this.fRoleId && ele['project_id'] == this.fProjectId){
                this.allWorkflowsForProjectAndRole.push(ele);
                this.enableWFDropdown=true;
              }
              
          });
          console.log(this.allWorkflowsForProjectAndRole);
        })
  }

  getWorkflowDetails(){
    let inpData={'project_id':this.fProjectId,'role_id':this.fRoleId,'workflow_id':this.fWorkflowId};
    console.log(inpData);
    this._serProjectWorkflow.getWorkflowDetailsForUpdate(inpData)
    .subscribe(res=>{
      // console.log(res['dbQryResponse'][0]['step_full_details']);
      this.statusGrid=res['dbQryResponse'][0]['step_full_details']
      console.log(this.statusGrid);

    });
  }

  updateWorkflow(){
    let nextAllowedStatuses:any[]=[];
    let s:any=[];
    this.statusGrid.forEach(e=>{
      s=[];
        e.nextStatuses.forEach(ns=>{
          if (ns.allowed ){
            s.push(ns.name);
          }
        })
        nextAllowedStatuses.push({status:e.status,nextStatuses:s});
    });

    let inpData={
      workflow_id:this.fWorkflowId,
      project_id: this.fProjectId,
      role_id:this.fRoleId,
      next_allowed_statuses:nextAllowedStatuses,
      step_full_details:this.statusGrid,
      modified_by:parseInt(localStorage.getItem('loggedInUserId'))
    }
    console.log(inpData);

    this._serProjectWorkflow.updateProjectWorkflow(inpData)
        .subscribe(res=>{
          console.log(res);
          this.statusGrid=[];
          this.fProjectId=-1;
          this.fRoleId=-1;
          this.fWorkflowId=-1;
          this.enableRoleDropdown=false;
          this.enableWFDropdown=false;
        });
  }

  cancelWorkflowUpdate(){
    this.statusGrid=[];
    this.fProjectId=-1;
    this.fRoleId=-1;
    this.fWorkflowId=-1;
    this.enableRoleDropdown=false;
    this.enableWFDropdown=false;
  }
}
