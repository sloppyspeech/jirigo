import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators  } from '@angular/forms';
import { ProjectsService  } from '../../../services/projects/projects.service';
import { UsersService  } from '../../../services/users/users.service';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Router} from '@angular/router'; 


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  createProjectFG:FormGroup;
  results:any[]=[];
  projectType:any[]=[
    {name:'Scrum',code:'Scrum'},
    {name:'Kanban',code:'Kanban'},
    {name:'ScrumBan',code:'ScrumBan'}
  ];
  projectList:any[]=[];


  constructor(private _formBuilder:FormBuilder,
              private _serProjects:ProjectsService,
              private _serNgxSpinner:NgxSpinnerService,
              private _serUserService:UsersService,
              private _router:Router) { }

  ngOnInit(): void {
    this._serNgxSpinner.show();
    this.createProjectFG=this._formBuilder.group({
      fctlProjectName:new FormControl({ value: '', disabled: false }, [Validators.required,Validators.minLength(5),Validators.maxLength(50)]),
      fctlProjectAbbr:new FormControl({ value: '', disabled: false }, [Validators.required,,Validators.minLength(3),Validators.maxLength(10)]),
      fctlProjectType:new FormControl({ value: '', disabled: false }, [Validators.required,,Validators.minLength(5),Validators.maxLength(15)]),
      fctlProjectCreatedBy:new FormControl({ value: '', disabled: false }),
      fctlProjectCreatedDate:new FormControl({ value: '', disabled: false }),
      fctlProjectModifiedBy:new FormControl({ value: '', disabled: false }),
      fctlProjectModifiedDate:new FormControl({ value: '', disabled: false }),
      fctlParentProject:new FormControl({ value: '', disabled: false })
    });
    setTimeout(() => {
        this._serNgxSpinner.hide();
    }, 200);

    this._serProjects.getAllProjects()
        .subscribe(res=>{
            console.log("$$$$$$$$$$$$$$$$$");
            console.log(res);
            if (res['dbQryStatus'] == "Success"){
              res['dbQryResponse'].forEach(p => {
                this.projectList.push({'name':p['project_name'],'project_id':p['project_id']});
              });
            }
            console.log(this.projectList);
        });

  }

  createProject(){
    let projData={
      "project_name":this.createProjectFG.get('fctlProjectName').value,
      "project_abbr":this.createProjectFG.get('fctlProjectAbbr').value,
      "project_type":this.createProjectFG.get('fctlProjectType').value,
      "parent_project_id":this.createProjectFG.get('fctlParentProject').value,
      "created_by":localStorage.getItem('loggedInUserId'),
      "is_active":'Y'
    };

    console.log(projData);

    this._serNgxSpinner.show();
    this._serProjects.createProject(projData)
        .subscribe(res=>{

            console.log("Project Creation Status");
            console.log(JSON.stringify(res));
            if (res['dbQryStatus'] == "Success"){
              console.log("Inside dbQryStatus Success");
              
            //   setTimeout(() => {
            //     this.createProjectFG.reset();
            //     this._serNgxSpinner.hide();
            // }, 3000);

              this.createProjectFG.reset();
              this._serNgxSpinner.hide();
              this._router.navigate(['/projects/list-projects']);
            }
        });


  }

  setProjectType(pt){

    this.createProjectFG.get('fctlProjectType').setValue(pt);
  }

  setParentProject(pp){
    console.log(pp.target.value);
    this.createProjectFG.get('fctlParentProject').setValue(pp);
  }

  cancelProjectCreationForm (){
    this.createProjectFG.reset();
    this._router.navigate(['/projects/list-projects']);
  }


}
