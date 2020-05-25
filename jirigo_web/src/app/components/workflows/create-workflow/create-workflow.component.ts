import { Component, OnInit } from '@angular/core';
import { ProjectWorkflowsService,infWorkflow } from './../../../services/workflows/project-workflows.service';
import { ProjectsService } from '../../../services/projects/projects.service';
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
  fprojectName:string="-1";
  allProjects:any[]=[];
  fworkflowName:string;
  showForm:boolean=false;

  statusGrid:Array< {
    status:string ,
    nextStatuses:Array<{
                        name:string,
                        allowed:boolean
                    }> 
  }>=[];

// projStatuses=['Open','Analysis','Dev'];
projStatuses=['Open','Analysis','Dev','Code Review','QA Testing','UAT','Release','Closed'];

  constructor(private _serProjectWorkflows:ProjectWorkflowsService,
              private _serProjectService:ProjectsService) { }

  ngOnInit(): void {

    this._serProjectService.getAllProjectsForUser(localStorage.getItem('loggedInUserId'))
        .subscribe(res=>{
            console.log(res);
            res['dbQryResponse'].forEach(ele => {
              this.allProjects.push({'project_id':ele['project_id'],'project_name':ele['project_name']})
            });
            this.showForm=true;
        });

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
        nextAllowedStatuses.push({status:e.status,nextSteps:s});
    });
    inpData={
      workflow_name:form.value.workflowName,
      project_id: parseInt(this.fprojectName),
      next_allowed_statuses:nextAllowedStatuses,
      step_full_details:this.statusGrid,
      created_by:parseInt(localStorage.getItem('loggedInUserId'))
    }
    console.log(inpData);

    // this._serProjectWorkflows.createProjectWorkflow(inpData)
    //     .subscribe(res=>{
    //       console.log(res);
    //     });

    }

    setProjectName(e){
      console.log("------------------");
      console.log(e);
    }
}
