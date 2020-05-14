import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersGridComponent  } from './users-grid/users-grid.component';
import { CreateUserComponent  } from './create-user/create-user.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { UsersRoutingModule } from './users-routing.module';
import { TableModule  } from 'primeng/table';
import { MultiSelectModule} from 'primeng/multiselect';
import { SelectButtonModule  } from 'primeng/selectbutton';
import { NgxSpinnerModule  } from 'ngx-spinner';
import { DialogModule } from "primeng/dialog";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [UsersGridComponent,CreateUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    MultiSelectModule,
    SelectButtonModule,
    DialogModule,
    ButtonModule,
    FontAwesomeModule,
    NgxSpinnerModule
  ]
})
export class UsersModule { }
