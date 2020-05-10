import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersGridComponent  } from './users-grid/users-grid.component';
import { CreateUserComponent  } from './create-user/create-user.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { TableModule  } from 'primeng/table';
import { MultiSelectModule} from 'primeng/multiselect';
import { NgxSpinnerModule  } from 'ngx-spinner';

@NgModule({
  declarations: [UsersGridComponent,CreateUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    MultiSelectModule,
    NgxSpinnerModule
  ]
})
export class UsersModule { }
