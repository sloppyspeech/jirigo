import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators,AbstractControl,ValidatorFn  } from '@angular/forms';
import { UsersService  } from '../../../services/users/users.service';
import { ProjectsService} from '../../../services/projects/projects.service';
import { Router,ActivatedRoute  } from '@angular/router';
import { NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  createFG:FormGroup;
  submitted:boolean=false;
  loading:boolean = false;
  errorsList:any[]=[];
  createFormInvalid:boolean=false;
  pwdConfirmPwdDontMatch:boolean=false;
  projectList:any[]=[];
  assignedProjects:any[]=[];
  showProj:boolean=false;


  constructor(
      private _formBuilder:FormBuilder,
      private _serUsers:UsersService,
      private _serProjects:ProjectsService,
      private _router:Router,
      private _ngxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.showProj=false;
    this.pwdConfirmPwdDontMatch=false;
    this.submitted=false;
    this.createFormInvalid=false;
    this.createFG=new FormGroup({
      email:new FormControl(null, [Validators.required,Validators.email]),
      firstName:new FormControl(null, Validators.required),
      lastName:new FormControl(null, Validators.required),
      password:new FormControl(null, Validators.required),
      assignedProjects:new FormControl([], Validators.required)
    });

    this._serProjects.getAllProjects()
        .subscribe(res=>{
          console.log(res['dbQryResponse']);
          console.log(res['dbQryStatus']);
          res['dbQryResponse'].forEach(project => {
            this.projectList.push({'label':project['project_name'],'value':project['project_id']});
          });
          console.log("==============");
          console.log(this.projectList);
          this.showProj=true;
        })
  }

  get rf(){
    return this.createFG.controls;
  }

  resetErrors(){
    this.submitted=false;
    this.errorsList=[];
    this.createFormInvalid=false;
  }

  createUser(){
    this.submitted=true;
    this.errorsList=[];
    this._ngxSpinner.show();
    let creationData={
      'first_name':this.rf.firstName.value,
      'last_name':this.rf.lastName.value,
      'email':this.rf.email.value,
      'password':this.rf.password.value,
      'is_active':'Y',
      'assigned_projects':this.rf.assignedProjects.value,
      'created_by':localStorage.getItem('loggedInUserId')
    };
    console.log(creationData);
    this._serUsers.createUser(creationData)
        .toPromise()
        .then(res =>{
            console.log("User Creation Successful");
            console.log(res);
            console.log(res['dbQryStatus']);
            if (res['dbQryStatus'] != "Success"){
              this._ngxSpinner.hide();
              this.createFormInvalid=true;
                this.errorsList.push("Error creating User, Please Contact Adminstrator");
            }
            else{
              setTimeout(() => {
                this._ngxSpinner.hide();
                this._router.navigate(['/user-management/all-users']);
              }, 2000);
            }

        })
        .catch(err=>{
            console.log("Error In createing User");
            console.log(err);
        });
  }
}
