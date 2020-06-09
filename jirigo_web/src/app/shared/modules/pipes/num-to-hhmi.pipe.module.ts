import { NumToHhmiPipe } from './num-to-hhmi.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    NumToHhmiPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    NumToHhmiPipe
  ]
})
export class NumToHhmiPipeModule { }
