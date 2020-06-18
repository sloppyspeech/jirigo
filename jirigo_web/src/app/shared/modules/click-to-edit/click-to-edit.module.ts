import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ClickToEditComponent } from './click-to-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [ClickToEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[ClickToEditComponent]
})
export class ClickToEditModule { }
