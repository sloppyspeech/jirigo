import { Injectable } from '@angular/core';
import { Router,ActivatedRoute,CanActivate,ActivatedRouteSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private _router:Router) { }

  canActivate(activeRouteSnapshot:ActivatedRouteSnapshot):boolean{
    if (!localStorage.getItem('loggedInUserId')){
      this._router.navigate(['login']);
      return false;
    }
    else{
      console.log("AuthGuardService :"+ this._router.url);
      // console.log(this._router.getCurrentNavigation());
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:"+activeRouteSnapshot.toString());
      console.log(activeRouteSnapshot.data);
      return true;
    }
  }
}
