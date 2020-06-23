import { ProjectCalendarComponent } from './project-calendar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectCalendarRoutingModule } from './project-calendar-routing.module';


@NgModule({
  declarations: [ProjectCalendarComponent],
  imports: [
    CommonModule,
    ProjectCalendarRoutingModule
  ]
})
export class ProjectCalendarModule { }
