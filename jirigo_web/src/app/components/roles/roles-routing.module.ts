import { AssignRolesComponent } from './assign-roles/assign-roles.component';
import { CrudRolesComponent } from './crud-roles/crud-roles.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:'crud-roles',
    component:CrudRolesComponent
  },
  {
    path:'assign-roles',
    component:AssignRolesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
