import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outage',
  templateUrl: './outage.component.html',
  styleUrls: ['./outage.component.css']
})
export class OutageComponent implements OnInit {
  toggleOutageCreUpdModal:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

}
