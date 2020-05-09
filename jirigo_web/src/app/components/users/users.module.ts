import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersGridComponent  } from './users-grid/users-grid.component';

import { UsersRoutingModule } from './users-routing.module';
import { TableModule  } from 'primeng/table';
import { NgxSpinnerModule  } from 'ngx-spinner';

@NgModule({
  declarations: [UsersGridComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TableModule,
    NgxSpinnerModule
  ]
})
export class UsersModule { }
