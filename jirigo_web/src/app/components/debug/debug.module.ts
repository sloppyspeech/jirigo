import { ClickToEditModule } from './../../shared/modules/click-to-edit/click-to-edit.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugRoutingModule } from './debug-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DebugRoutingModule,
    ClickToEditModule
  ]
})
export class DebugModule { }
