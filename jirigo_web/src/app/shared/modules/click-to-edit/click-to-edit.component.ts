import { FormControl } from '@angular/forms';
import { Component, OnInit,  Renderer2, ElementRef, ViewChild, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'click-to-edit',
  templateUrl: './click-to-edit.component.html',
  styleUrls: ['./click-to-edit.component.css']
})
export class ClickToEditComponent implements OnInit {
  labelDivToggle:boolean=false;
  @Input() fc:FormControl;

  @ViewChild('inputText',{static:false}) inputText:ElementRef;
  constructor(private _renderer:Renderer2 , 
              private _changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit(): void {
  }


  toggleInput(e){
    if (e.type != "focusout"){ 
      this.labelDivToggle=!this.labelDivToggle;
      this._changeDetectorRef.detectChanges();
    }
    if (this.labelDivToggle){
      this.inputText.nativeElement.focus();
    }
    if(e.type == "focusout") {
      this.fc.setValue(this.inputText.nativeElement.value);
      this.labelDivToggle=!this.labelDivToggle;
    }
  }
}
