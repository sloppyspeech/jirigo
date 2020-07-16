import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent  } from './dashboard.component';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';
import { SprintTasksDashboardComponent } from './sprint-tasks-dashboard/sprint-tasks-dashboard.component';

const routes: Routes = [{
  path:'ticket-dashboard',
  component:DashboardComponent,
  canActivate:[AuthGuard,RoleGuard],
},{
  path:'sprint-tasks-dashboard',
  component:SprintTasksDashboardComponent,
  canActivate:[AuthGuard,RoleGuard],
},
{
  path:'',
  component:DashboardComponent,
  canActivate:[AuthGuard,RoleGuard],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
