import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jirigo';
  showMenu:boolean=false;

  ngOnInit() {
    localStorage.setItem('loggedInUserId','1');
    localStorage.setItem('currentProjectId','4');
  }
  openNav(){
    alert('called '+this.showMenu);
    this.showMenu!=this.showMenu;
  }

}

