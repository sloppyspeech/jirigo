import { ReactiveFormsModule } from '@angular/forms';
import { ProjectCalendarComponent } from './project-calendar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProjectCalendarRoutingModule } from './project-calendar-routing.module';


@NgModule({
  declarations: [ProjectCalendarComponent],
  imports: [
    CommonModule,
    ProjectCalendarRoutingModule,
    NgxSpinnerModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class ProjectCalendarModule { }
