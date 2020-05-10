import { Component,OnInit } from '@angular/core';
import { UsersService  } from './services/users/users.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jirigo';

  constructor( private _serUser:UsersService
            )
  {
  }

  
  ngOnInit() {

  }
  

}

