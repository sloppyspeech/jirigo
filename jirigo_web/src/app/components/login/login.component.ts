import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators  } from '@angular/forms';


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

  constructor(
              private _formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.loginFB=this._formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  get lf(){
    return this.loginFB.controls;
  }

  onSubmit(){
    alert(this.lf.email.valid);
    alert(this.lf.password.valid);
    return;
  }

}
