import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
  {
    path:'all-users',
    component:UsersGridComponent
  },
  {
    path:'create-user',
    component:CreateUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
