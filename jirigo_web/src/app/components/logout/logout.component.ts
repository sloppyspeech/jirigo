import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService  } from 'ngx-spinner';
import { Router  } from '@angular/router';
import { UsersService} from '../../services/users/users.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _serNgxSpinner:NgxSpinnerService,
              private _router:Router,
              private _serUsers:UsersService) { }


  ngOnInit(): void {
    this._serNgxSpinner.show();
    // localStorage.clear();
    this._serUsers.isLoggedIn.next(false);
    this._serUsers.loggedInUserProps.next({});

    setTimeout(() => {
      this._serNgxSpinner.hide();
      this._router.navigate(['login']);
    }, 1000);
  }

}
