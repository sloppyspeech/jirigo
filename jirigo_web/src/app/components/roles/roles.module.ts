import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { CrudRolesComponent } from './crud-roles/crud-roles.component';
import { AssignRolesComponent } from './assign-roles/assign-roles.component';
import { AssignMenusToRoleComponent } from './assign-menus-to-role/assign-menus-to-role.component';

import { PickListModule} from 'primeng/picklist';


@NgModule({
  declarations: [CrudRolesComponent, AssignRolesComponent, AssignMenusToRoleComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    PickListModule
  ]
})
export class RolesModule { }
