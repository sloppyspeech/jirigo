import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSprintComponent  } from './create-sprint/create-sprint.component';
import { ListSprintsComponent  } from './list-sprints/list-sprints.component';
import { EditSprintsComponent  } from './edit-sprints/edit-sprints.component';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';

const routes: Routes = [
  {
    path:'create-sprint',
    component:CreateSprintComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'list-sprints',
    component:ListSprintsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'edit-sprints/:sprint_id',
    component:EditSprintsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'edit-sprints',
    component:EditSprintsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'**',
    component:ListSprintsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SprintRoutingModule { }
