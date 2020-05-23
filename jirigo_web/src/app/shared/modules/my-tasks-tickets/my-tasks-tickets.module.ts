import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import{ FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TableModule} from 'primeng/table';
import { ButtonModule} from 'primeng/button';

import { MyTasksTicketsRoutingModule } from './my-tasks-tickets-routing.module';
import { MyTasksTicketsComponent} from './my-tasks-tickets.component';

@NgModule({
  declarations: [MyTasksTicketsComponent],
  imports: [
    CommonModule,
    MyTasksTicketsRoutingModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    TableModule,
    ButtonModule
  ]
})
export class MyTasksTicketsModule { 

}
