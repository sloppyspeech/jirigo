import { Component, OnInit, ViewChild, ElementRef,Input,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-create-update-outage',
  templateUrl: './create-update-outage.component.html',
  styleUrls: ['./create-update-outage.component.css']
})
export class CreateUpdateOutageComponent implements OnInit {
  @Input('toggleoutageCreUpdModalBtn') toggleoutageCreUpdModalBtn:boolean=false;
  @ViewChild('outageCreUpdModalBtn') outageCreUpdModalBtn:ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if(propName == 'toggleoutageCreUpdModalBtn') {
        console.log('ngOnChanges');
        console.log(this.toggleoutageCreUpdModalBtn);
        if (this.toggleoutageCreUpdModalBtn){
          this.outageCreUpdModalBtn.nativeElement.click();
        }
      }
    }
  }
}
