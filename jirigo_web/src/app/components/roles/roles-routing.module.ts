import { AssignMenusToRoleComponent } from './assign-menus-to-role/assign-menus-to-role.component';
import { AssignRolesComponent } from './assign-roles/assign-roles.component';
import { CrudRolesComponent } from './crud-roles/crud-roles.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  AuthGuardService as AuthGuard } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';


const routes: Routes = [
  {
    path:'crud-roles',
    component:CrudRolesComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'assign-roles',
    component:AssignRolesComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'assign-menus-to-role',
    component:AssignMenusToRoleComponent,
    canActivate:[AuthGuard,RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
