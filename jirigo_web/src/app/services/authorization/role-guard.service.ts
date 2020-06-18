import { Injectable, OnInit } from "@angular/core";
import {Observable} from 'rxjs';
import { take, map, switchMap, first } from 'rxjs/operators';
import {
  Router,
  ActivatedRoute,
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  RouterState
} from "@angular/router";

import { UsersService} from '../../services/users/users.service';

@Injectable({
  providedIn: "root",
})
export class RoleGuardService implements CanActivate {
  loggedInUserId: string = "";
  loggedInUserRoleId: string = "";
  loggedUserProjectId: string = "";

  constructor(private _router: Router, private _serUsers:UsersService ,private _activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.loggedInUserId = localStorage.getItem("loggedInUserId");
    this.loggedInUserRoleId = localStorage.getItem("loggedInUserRoleId");
    this.loggedUserProjectId = localStorage.getItem("currentProjectId");
    console.log("-------------RoleGuardService-----------------");
    console.log(this.loggedInUserId);
    console.log(this.loggedInUserRoleId);
    console.log(this.loggedUserProjectId);
    console.log("----------------------------------------------");
  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot,_routerStateSnapShot:RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.loggedInUserId = localStorage.getItem("loggedInUserId");
    this.loggedInUserRoleId = localStorage.getItem("loggedInUserRoleId");
    this.loggedUserProjectId = localStorage.getItem("currentProjectId");
    let inpData={
      'project_id': this.loggedUserProjectId,
      'user_id':this.loggedInUserId,
      'role_id':this.loggedInUserRoleId,
      'current_route': _routerStateSnapShot.url.indexOf('?') == -1 ? _routerStateSnapShot.url : _routerStateSnapShot.url.substring(0,_routerStateSnapShot.url.indexOf('?'))
      // 'current_route':activatedRouteSnapshot.routeConfig.path
    }
    console.log("=======================");
    console.log(activatedRouteSnapshot);
    console.log(this._activatedRoute.snapshot);
    console.log(this._activatedRoute.snapshot.firstChild?.url[0]?.path); // array of states
    console.log(activatedRouteSnapshot.routeConfig.path );
    console.log(_routerStateSnapShot?.url);
    console.log( activatedRouteSnapshot.routeConfig.path.indexOf(':') );
    console.log("--*--*--*--*--*--*--*--*--*--*--");
    console.log(_routerStateSnapShot);
    console.log(this._router.config);
    console.log(inpData);
    console.log("=======================");

    return this._serUsers.authorizeCurrentRouteForUser(inpData).pipe(
      take(1),
      map((res) => {
      console.log("---authorizeCurrentRouteForUser---");   
      console.log(res);
      console.log("------------------------%%%%%%%-------------");
      if (res['dbQryStatus'] == "Success"){
          return true;
      }
      else {
        alert('Access Denied to requested URL, You will be logged out');
        // localStorage.clear();
        // this._router.navigate(['logout']);
        // return false;
      }
      })
    );
  }



}
