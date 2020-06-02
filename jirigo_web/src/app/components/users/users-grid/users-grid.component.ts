import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService  } from 'ngx-spinner';
import { UsersService } from './../../../services/users/users.service';
import { faPencilAlt,faEdit,faCogs,faRegistered } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.css']
})
export class UsersGridComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faEdit=faEdit;
  faCogs=faCogs;
  faRegistered=faRegistered;
  showUserGrid:boolean=false;
  userEmailForPwdChange:string='';
  newPassword='';

  cols:any[] = [
    { field: 'first_name', header: 'First Name',width:'13%' },
    { field: 'last_name', header: 'Last Name' ,width:'13%' },
    { field: 'email', header: 'Email' ,width:'25%' },
    { field: 'is_active', header: 'Active ' ,width:'10%' },
    { field: 'password_change_date', header: 'Password Change Date' ,width:'15%' }
];

  users:any[]=[];

  constructor(private _serNgxSpinner:NgxSpinnerService,
              private _serUsers:UsersService
             ) { }


  ngOnInit(): void {

    this.loadUserDetails();

  }

  openChangePasswordModal(userDetails){
    this.userEmailForPwdChange=userDetails.email;
    console.log(userDetails);
  }

  changePassword(){
    let inpData={
      'email':this.userEmailForPwdChange,
      'password':this.newPassword,
      'modified_by':localStorage.getItem('loggedInUserId')
    };
    console.log(inpData);
    this._serUsers.setPassword(inpData)
        .subscribe(res=>{
          console.log('================');
          console.log(res);
          if(res['dbQryStatus'] == "Success"){
            this.loadUserDetails();
          }
        });
  }

  userEditModalDialogAction(action:string){

  }

  loadUserDetails(){
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

  toggleUserActiveStatus(userDetails){
    let inpData={
      'user_id': userDetails.user_id,
      'is_active':userDetails.is_active == 'N' ? 'Y' : 'N',
      'modified_by':localStorage.getItem('loggedInUserId')
    }
    console.log(userDetails);
    console.log(inpData);
    this._serUsers.activateInactivateUser(inpData)
        .subscribe(res=>{
          console.log(res);
          this.loadUserDetails();
        });
  }


}
