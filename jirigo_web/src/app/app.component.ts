import { Component,OnInit } from '@angular/core';
import { UsersService  } from './services/users/users.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( private _serUser:UsersService
            )
  {
  }
  title = 'Jirigo';
  showMenu:boolean=true;
  loggedIn:boolean=true;
  loggedInUserName:string;
  currentProjectName:string;
  
  ngOnInit() {
    this._serUser.isLoggedIn.subscribe(res=>{
      console.log("App Component Init");
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
      }
    });

    this._serUser.loggedInUserProps.subscribe(res =>{
      console.log("Inside loggedInUserProps");  
      console.log(res);
      console.log(typeof res['user_name'] );

      //when user just refreshes the page
      if (typeof(res['user_name']) !== 'undefined' ){
        this.loggedInUserName=res['user_name'];
        this.currentProjectName=res['project_name'];
      }
      else{
        this.loggedInUserName=localStorage.getItem('loggedInUserName');
        this.currentProjectName=localStorage.getItem('currentProjectName');
      }
    });
  }
  
  openNav(){
    alert('called '+this.showMenu);
    this.showMenu!=this.showMenu;
  }

  ngOnDestroy() {
    this._serUser.isLoggedIn.unsubscribe();
    this._serUser.loggedInUserProps.unsubscribe();
  }

}

