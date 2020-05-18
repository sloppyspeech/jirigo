import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';

const routes: Routes = [
  {
    path:'all-users',
    component:UsersGridComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'create-user',
    component:CreateUserComponent,
    canActivate:[AuthGuard,RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
