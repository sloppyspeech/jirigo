import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutageRoutingModule } from './outage-routing.module';
import { OutageComponent } from './outage.component';
import { CreateUpdateOutageComponent } from './create-update-outage/create-update-outage.component';


@NgModule({
  declarations: [OutageComponent, CreateUpdateOutageComponent],
  imports: [
    CommonModule,
    OutageRoutingModule
  ]
})
export class OutageModule { }
