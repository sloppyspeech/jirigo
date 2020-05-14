import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService  } from 'ngx-spinner';
import { UsersService } from './../../../services/users/users.service';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.css']
})
export class UsersGridComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  showUserGrid:boolean=false;

  cols:any[] = [
    { field: 'first_name', header: 'First Name' },
    { field: 'last_name', header: 'Last Name' },
    { field: 'email', header: 'Email' },
    { field: 'is_active', header: 'Active ' },
    { field: 'password_change_date', header: 'Password Change Date' }
];

  users:any[]=[];

  constructor(private _serNgxSpinner:NgxSpinnerService,
              private _serUsers:UsersService
             ) { }


  ngOnInit(): void {

    this._serUsers.getAllActiveUsers()
        .toPromise()
        .then(res=>{
            console.log("In Service Get All Active Users");
            console.log(res);
            if (res['dbQryStatus'] == "Success"){
              this.users=res['dbQryResponse'];
            }
        })
        .catch(err=>{
          console.log("In Service Get All Active Users ERRORs");
          console.log(err);
        });

  }

}
