import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeProjectComponent } from './change-project/change-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';


const routes: Routes = [
  {
    path:'change-project',
    component:ChangeProjectComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'create-project',
    component:CreateProjectComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'list-projects',
    component:ListProjectsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'edit-project',
    component:EditProjectComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'**',
    component:ListProjectsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
