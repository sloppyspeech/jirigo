import { Injectable } from '@angular/core';
import { Router,ActivatedRoute,CanActivate} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private _router:Router) { }

  canActivate():boolean{
    if (!localStorage.getItem('loggedInUserId')){
      this._router.navigate(['login']);
      return false;
    }
    else{
      return true;
    }
  }
}
