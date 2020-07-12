
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugRoutingModule } from './debug-routing.module';
import { ClickToEditModule } from './../../shared/modules/click-to-edit/click-to-edit.module';
import { ColorPickerModule } from './../../shared/modules/color-picker/color-picker.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DebugRoutingModule,
    ClickToEditModule,
    ColorPickerModule
  ]
})
export class DebugModule { }
