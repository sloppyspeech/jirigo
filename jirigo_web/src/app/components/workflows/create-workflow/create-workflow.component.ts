import { Component, OnInit } from '@angular/core';
import { ProjectWorkflowsService,infWorkflow } from './../../../services/workflows/project-workflows.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { StaticDataService } from './../../../services/static-data.service';
import { faLongArrowAltRight,faArrowDown,faArrowRight,faInfoCircle,faInfo} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.css']
})
export class CreateWorkflowComponent implements OnInit {
  faLongArrowAltRight=faLongArrowAltRight;
  faArrowRight=faArrowRight;
  faArrowDown=faArrowDown;
  faInfo=faInfo;
  faInfoCircle=faInfoCircle;
  fprojectId:number=-1;
  fWorkflowType:string='-1';
  allProjects:any[]=[];
  fworkflowName:string;
  showForm:boolean=false;
  enableWorkflowTypeDropDown:boolean=false;

  statusGrid:Array< {
    status:string ,
    nextStatuses:Array<{
                        name:string,
                        allowed:boolean
                    }> 
  }>=[];

// projStatuses=['Open','Analysis','Dev'];
  // projStatuses=['Open','Analysis','Dev','Code Review','QA Testing','UAT','Released','Closed'];
  projStatuses:any[]=[];

  constructor(private _serProjectWorkflows:ProjectWorkflowsService,
              private _serProjectService:ProjectsService,
              private _serStaticData:StaticDataService) { }

  ngOnInit(): void {
    this.projStatuses=[];
    this.enableWorkflowTypeDropDown=false;
    this._serProjectService.getAllProjectsForUser(localStorage.getItem('loggedInUserId'))
        .subscribe(res=>{
            console.log(res);
            res['dbQryResponse'].forEach(ele => {
              this.allProjects.push({'project_id':ele['project_id'],'project_name':ele['project_name']})
            });
            this.showForm=true;
        });

        this.setStatusGrid();
  }

  setStatusGrid(){
    this.statusGrid=[];
    this.projStatuses.forEach(ps=>{
      let s:any[]=[];
      this.projStatuses.forEach(nxtSts=>{

        // Make current status to be part of the next statuses always.
        if(ps === nxtSts){
          s.push({name:nxtSts,allowed:true})
        }
        else{
          s.push({name:nxtSts,allowed:false})
        }
      });

      this.statusGrid.push({status:ps,nextStatuses:s});
  });
  console.log(this.statusGrid);
  }
  submitForm(form:any){
    let inpData:infWorkflow;
    let nextAllowedStatuses:any[]=[];
    let s:any[]=[];
    console.log(form.value);
    console.log(this.statusGrid);
    this.statusGrid.forEach(e=>{
      s=[];
        e.nextStatuses.forEach(ns=>{
          if (ns.allowed ){
            s.push(ns.name);
          }
        })
        nextAllowedStatuses.push({status:e.status,nextStatuses:s});
    });
    inpData={
      workflow_name:form.value.workflowName,
      project_id: this.fprojectId,
      workflow_type:this.fWorkflowType,
      next_allowed_statuses:nextAllowedStatuses,
      step_full_details:this.statusGrid,
      created_by:parseInt(localStorage.getItem('loggedInUserId'))
    }
    console.log(inpData);

    this._serProjectWorkflows.createProjectWorkflow(inpData)
        .subscribe(res=>{
          console.log(res);
          this.statusGrid=[];
          this.fWorkflowType="-1";
          this.fprojectId=-1;
        });

    }

    setProjectName(e){
      this.enableWorkflowTypeDropDown = this.fprojectId != -1 ? true :false;
      this.fWorkflowType="-1";
      console.log("------------------");
      console.log(e);
    }

    setWorkFlowType(e){
      let inpData={
        'project_id':this.fprojectId,
        'ref_category':this.fWorkflowType
      }
      this.projStatuses=[];
      console.log(this.fWorkflowType);
      console.log('here int ickets');
        this._serProjectWorkflows.getAllStatusesForWorkflows (inpData)
            .subscribe(res =>{
              console.log(res);
              res['dbQryResponse'].forEach(element => {
                this.projStatuses.push(element['ref_value']);
              });
              this.setStatusGrid();
            });
    }
}
