import { Component,OnInit,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jirigo';
  jirigoBroadcastChannel;
  // @HostListener('window:beforeunload')
  // clearLocalStorage() {
  //   /*  
  //     Logout the user when the window/tab is closed.
  //   */
  //   localStorage.clear();
  // }


  constructor(){}

  
  ngOnInit() {
    this.jirigoBroadcastChannel= new BroadcastChannel('jirigo-broadcast');
    this.jirigoBroadcastChannel.onmessage = (message) =>{
      console.log("*******App Message broadcast*********");
      console.log(message);
      console.log("***************")
    };
  }
  

}

