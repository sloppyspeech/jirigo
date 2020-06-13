import { MenusService } from './../../services/menus/menus.service';
import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { UsersService  } from '../../services/users/users.service';
import { ChangeProjectComponent  } from '../projects/change-project/change-project.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit,AfterViewInit {
  @ViewChild('ChangeProjectComponent') changeProjectComponent:ChangeProjectComponent;

  loggedIn:boolean=false;
  loggedInUserName:string;
  loggedInUserRole:string='';
  showMenu:boolean=true;
  currentProjectName:string;
  showProjectChangeMenu:boolean=false;
  random_avatar_png_no=1;
  validUserMenuPaths:any={};

  constructor(private _serUser:UsersService,
              private _serMenu:MenusService) { }

  ngOnInit(): void {
    console.log('MenuComponent Init :loggedIn:'+this.loggedIn);
    let date = new Date;
    let seconds = date.getSeconds();
    this.random_avatar_png_no = seconds%30;
    this.loggedIn=false;



    this._serUser.isLoggedIn.subscribe(res=>{
      console.log("Menu Component Init :"+this.loggedIn);
      console.log(res);
      console.log(localStorage.getItem('loggedInUserId'));
      console.log(localStorage.getItem('loggedInUserName'));
      console.log(localStorage.getItem('currentProjectName'));

      //when user just refreshes the page
      if (res ){
        this.loggedIn=res;
      }
      else{
        if (localStorage.getItem('loggedInUserId') == null){
          this.loggedIn=false;
        }
        else{
          this.loggedIn=true;
        }
      }
      let inpData={
        'project_id':localStorage.getItem('currentProjectId'),
        'user_id':localStorage.getItem('loggedInUserId'),
        'role_id':localStorage.getItem('loggedInUserRoleId')
      };
      console.log(inpData); 
      this._serMenu.getAllValidUserRoutesForMenu(inpData)
      .subscribe(res=>{
          console.log(res);
          if (res['dbQryResponse'] && res['dbQryStatus']=="Success"){
            res['dbQryResponse'].forEach(e => {
                this.validUserMenuPaths[e.path]=true;
            });
          }
          console.log(this.validUserMenuPaths);
          console.log(this.validUserMenuPaths['/homepage']);
      });
      console.log("End Menu Component Init :"+this.loggedIn);
    });
 
    this._serUser.loggedInUserProps.subscribe(res =>{
      console.log("Inside loggedInUserProps ");  
      console.log(res);
      console.log(typeof res['user_name'] );

      //when user just refreshes the page
      if (typeof(res['user_name']) !== 'undefined' ){
        this.loggedInUserName=res['user_name'];
        this.currentProjectName=res['project_name'];
        this.loggedInUserRole=res['role_name'];
      }
      else{
        this.loggedInUserName=localStorage.getItem('loggedInUserName');
        this.currentProjectName=localStorage.getItem('currentProjectName');
        this.loggedInUserRole=localStorage.getItem('loggedInUserRoleName');
        console.log(localStorage.getItem('loggedInUserId'));
        console.log(localStorage.getItem('loggedInUserName'));
        console.log(localStorage.getItem('currentProjectName'));
        console.log("@@@@@@@@@@@ :"+this.loggedInUserRole);
      }


    });
  }

  ngAfterViewInit(){
      
  }

  ngOnDestroy() {
    this._serUser.isLoggedIn.unsubscribe();
    this._serUser.loggedInUserProps.unsubscribe();
  }

  changeProject(e){
    console.log("Inside Change Project");
    console.log(e);
    this.showProjectChangeMenu=true;
  }

}
