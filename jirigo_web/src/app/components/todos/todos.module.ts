import { TodosComponent } from './todos.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TodosRoutingModule } from './todos-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerModule } from './../../shared/modules/color-picker/color-picker.module';

@NgModule({
  declarations: [TodosComponent],
  imports: [
    CommonModule,
    TodosRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    ColorPickerModule
  ]
})
export class TodosModule { }
