import { Component, OnInit,Input } from '@angular/core';
import { FormGroup,FormBuilder  } from '@angular/forms';
import { UsersService  } from '../../../services/users/users.service';
import { Observable, of} from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-select-user-comp',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {

  @Input()
  parentForm:FormGroup;

  searching = false;
  searchFailed = false;
  
  retUserNameVal=[];
  retUserNameArr=[];

  constructor(private _serUsers:UsersService) { }

  ngOnInit(): void {
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(term =>
      this._serUsers.getUserNamesForDropDownSearch(term).pipe(
        tap((res) => {
          console.log(res);
          this.searchFailed = false
        }),
        catchError((res) => {
          this.searchFailed = true;
          console.log('***********ERROR******************');
          console.log(res);
          console.log('*****************************');
          return of([]);
        })
        ),
    ),
    map((res)=>{
      this.retUserNameVal=[];
      this.retUserNameArr=res;
      // console.log(res.length);
      if (res != null){
      res.forEach(element => {
        console.log("=*=*=*=*=*=*=*=*=*=*");
        console.log(element);
        this.retUserNameVal.push(element.name);
        console.log("=*=*=*=*=*=*=*=*=*=*");
      });
    }
      // console.log(res);
      // Array(res.name)
      return this.retUserNameVal;
    }),
    tap(() => this.searching = false)
  )

}
