import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {
  // '#10C19F'

  @Input() showColorPicker:boolean=false;
  @Output() selectedColorHex = new EventEmitter;
  defaultColors:string[]=[
      '#00A5E3','#8DD7BF','#FF96C5','#FF5768','#ffffff',
      '#FFBF65','#FC6238','#F2D4CC','#E77577','#6C88C4',
      '#C05780','#FF828B','#E7C582','#00B0BA','#0065A2',
      '#C0CDAC','#FF6F68','#FFDACC','#FF60A8','#CFF800',
      '#FF5C77','#4DD091','#FFEC59','#FFA23A','#74737A'
  ];

  constructor() { }
  
  ngOnInit(): void {
  }
  
  selectedColor (colorHex) {
      console.log(colorHex);
      this.selectedColorHex.emit(colorHex);
  }
}

