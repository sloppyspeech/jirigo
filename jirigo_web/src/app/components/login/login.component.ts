import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators  } from '@angular/forms';
import { UsersService  } from '../../services/users/users.service';
import { Router  } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFB:FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  loginFormInvalid:boolean=false;
  errorsList:any[]=[];

  constructor(
              private _formBuilder:FormBuilder,
              private _serUsers:UsersService,
              private _router:Router
            ) { }

  ngOnInit(): void {
    console.log('LoginComponent ')
    console.log(localStorage.getItem('loggedInUserId'));
    console.log(localStorage.getItem('loggedInUserName'));
    console.log(localStorage.getItem('currentProjectName'));
    console.log('-------------');
    // localStorage.clear();
    this.loginFormInvalid=false;
    this.errorsList=[];
    this.loginFB=this._formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  get lf(){
    return this.loginFB.controls;
  }

  onSubmit(){
    // localStorage.clear();
    this._serUsers.isLoggedIn.next(false);

    this.errorsList=[];
    this.loginFormInvalid=false;
    console.log(this.lf.email.valid);
    console.log(this.lf.password.valid);
    let loginData={
      email:this.lf.email.value,
      password:this.lf.password.value
    }
    this._serUsers.login(loginData)
        .toPromise()
        .then(res=>{
            console.log("Login Status ");
            console.log(res);
            if (res['dbQryStatus'] != "Success"){
              this.loginFormInvalid=true;
              console.log(res['dbQryResponse']);
              this.errorsList.push(res['dbQryResponse']);
            }
            else{
              localStorage.setItem('loggedInUserId',res['dbQryResponse'][0]['user_id']);
              localStorage.setItem('loggedInUserName',res['dbQryResponse'][0]['user_name']);
              localStorage.setItem('currentProjectId',res['dbQryResponse'][0]['project_id']);
              localStorage.setItem('currentProjectName',res['dbQryResponse'][0]['project_name']);
              localStorage.setItem('loggedInUserRoleId',res['dbQryResponse'][0]['role_id']);
              localStorage.setItem('loggedInUserRoleName',res['dbQryResponse'][0]['role_name']);
              this._serUsers.isLoggedIn.next(true);
              this._serUsers.loggedInUserProps.next(res['dbQryResponse'][0]);
              this._router.navigate(['homepage']);
            }

        })
        .catch(err=>{
            console.log("Error While login");
            console.log(err);
        });
  }

}
