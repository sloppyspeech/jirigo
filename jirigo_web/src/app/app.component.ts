import { Component,OnInit,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jirigo';

  // @HostListener('window:beforeunload')
  // clearLocalStorage() {
  //   /*  
  //     Logout the user when the window/tab is closed.
  //   */
  //   localStorage.clear();
  // }


  constructor(){}

  
  ngOnInit() {}
  

}

