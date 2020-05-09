import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators,AbstractControl,ValidatorFn  } from '@angular/forms';
import { UsersService  } from '../../services/users/users.service';
import { Router,ActivatedRoute  } from '@angular/router';
import { NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFG:FormGroup;
  submitted:boolean=false;
  loading:boolean = false;
  errorsList:any[]=[];
  registerFormInvalid:boolean=false;
  pwdConfirmPwdDontMatch:boolean=false;

  constructor(
      private _formBuilder:FormBuilder,
      private _serUsers:UsersService,
      private _router:Router,
      private _ngxSpinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.pwdConfirmPwdDontMatch=false;
    this.submitted=false;
    this.registerFormInvalid=false;
    this.registerFG=new FormGroup({
      email:new FormControl(null, [Validators.required,Validators.email]),
      firstName:new FormControl(null, Validators.required),
      lastName:new FormControl(null, Validators.required),
      password:new FormControl(null, Validators.required),
      confirmedPassword:new FormControl(null, Validators.required)
    },this.validatePasswords);
  }

  get rf(){
    return this.registerFG.controls;
  }

  resetErrors(){
    this.submitted=false;
    this.errorsList=[];
    this.registerFormInvalid=false;
  }

  validatePasswords: ValidatorFn = (fg: FormGroup) => {
    let password = fg.get('password')?.value;
    let confirmedPassword = fg.get('confirmedPassword')?.value;
    console.log(password +":"+confirmedPassword);
    console.log(fg.errors);
    // console.log(fg.get('confirmedPassword').dirty);
    // console.log(fg.get('confirmedPassword').touched);
    if(password !== null && confirmedPassword !== null && password === confirmedPassword){
      console.log("Passwords Match");
      fg.errors['passwordsDontMatch']=false;
      console.log(fg.errors['passwordsDontMatch']);
      this.pwdConfirmPwdDontMatch=false;
    }
    else{
      this.pwdConfirmPwdDontMatch=true;
    }
    return password !== null && confirmedPassword !== null && password === confirmedPassword
      ? null
      : { passwordsDontMatch: true };
  };

  registerUser(){
    this.submitted=true;
    this.errorsList=[];
    this._ngxSpinner.show();
    console.log(this.registerFG.getRawValue());
    let registrationData={
      'first_name':this.rf.firstName.value,
      'last_name':this.rf.lastName.value,
      'email':this.rf.email.value,
      'password':this.rf.password.value,
      'is_active':'Y'
    };
    console.log(registrationData);
    this._serUsers.registerUser(registrationData)
        .toPromise()
        .then(res =>{
            console.log("User Registration Successful");
            console.log(res);
            console.log(res['dbQryStatus']);
            if (res['dbQryStatus'] != "Success"){
              this._ngxSpinner.hide();
              // this._router.navigate(['login']); 
              this.registerFormInvalid=true;
                this.errorsList.push("Error Registering User, Please Contact Adminstrator");
            }
            else{
              setTimeout(() => {
                this._ngxSpinner.hide();
                this._router.navigate(['login']);
              }, 2000);
            }

        })
        .catch(err=>{
            console.log("Error In registering User");
            console.log(err);
        });
  }

}
