import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators  } from '@angular/forms';
import { ProjectsService  } from '../../../services/projects/projects.service';
import { UsersService  } from '../../../services/users/users.service';
import { NgxSpinnerService  } from 'ngx-spinner';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  createProjectFG:FormGroup;
  results:any[]=[];

  constructor(private _formBuilder:FormBuilder,
              private _serProjects:ProjectsService,
              private _serNgxSpinner:NgxSpinnerService,
              private _serUserService:UsersService) { }

  ngOnInit(): void {
    this.createProjectFG=this._formBuilder.group({
      fctlProjectName:new FormControl({ value: '', disabled: false }, [Validators.required,Validators.minLength(5),Validators.maxLength(50)]),
      fctlProjectAbbr:new FormControl({ value: '', disabled: false }, [Validators.required,,Validators.minLength(3),Validators.maxLength(10)]),
      fctlProjectType:new FormControl({ value: '', disabled: false }, [Validators.required,,Validators.minLength(5),Validators.maxLength(15)]),
      fctlProjectCreatedBy:new FormControl({ value: '', disabled: false }),
      fctlProjectCreatedDate:new FormControl({ value: '', disabled: false }),
      fctlProjectModifiedBy:new FormControl({ value: '', disabled: false }),
      fctlProjectModifiedDate:new FormControl({ value: '', disabled: false })
    });
    this._serNgxSpinner.show();
    setTimeout(() => {
        this._serNgxSpinner.hide();
    }, 1000);
  }

  createProject(){
    let projData={
      "project_name":this.createProjectFG.get('fctlProjectName').value,
      "project_abbr":this.createProjectFG.get('fctlProjectAbbr').value,
      "project_type":this.createProjectFG.get('fctlProjectType').value,
      "created_by":localStorage.getItem('loggedInUserId')
    };
    this._serNgxSpinner.show();
    this._serProjects.createProject(projData)
        .subscribe(res=>{

            console.log("Project Creation Status");
            console.log(JSON.stringify(res));
            if (res['dbQryStatus'] == "Success"){
              console.log("Inside dbQryStatus Success");
              setTimeout(() => {
                this.createProjectFG.reset();
                this._serNgxSpinner.hide();
            }, 3000);
            }
        });
  }

  cancelProjectCreationForm (){

  }
  search(event) {
    let queryRes:any[]=[];
      this._serUserService.getUserNamesForDropDownSearch(event.query)
        .subscribe(data => {
          console.log("********************");
          console.log(data);
          console.log(data.length);
          console.log(this.results);
          for(var i=0; i<data.length;i++){
            console.log(data[i]["name"]);
            queryRes.push(data[i]['name']);
          }
          this.results=queryRes;
          console.log("=========:"+this.results);
      });
  }

}
