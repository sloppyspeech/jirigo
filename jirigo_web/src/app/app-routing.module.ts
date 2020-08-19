import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent  } from './components/login/login.component';
import { LogoutComponent  } from './components/logout/logout.component';
import { RegisterComponent  } from './components/register/register.component';
import { AuthGuardService as AuthGuard } from './services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard} from './services/authorization/role-guard.service';
import { DebugComponent} from './components/debug/debug.component';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'logout',
    component:LogoutComponent
  },
  {
    path:'debug',
    component:DebugComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'homepage',
    loadChildren: () => import('./components/homepage/homepage.module').then( m => m.HomepageModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'tickets',
    loadChildren: () => import('./components/tickets/tickets.module').then( m => m.TicketsModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'projects',
    loadChildren: () => import('./components/projects/projects.module').then( m => m.ProjectsModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'tasks',
    loadChildren: () => import('./components/tasks/tasks.module').then( m => m.TasksModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'boards',
    loadChildren:() => import ('./components/boards/boards.module').then(m=> m.BoardsModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then( m => m.DashboardModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'sprints',
    loadChildren: () => import('./components/sprints/sprint.module').then( m => m.SprintModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'user-management',
    loadChildren: () => import('./components/users/users.module').then( m => m.UsersModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'refdata-management',
    loadChildren: () => import('./components/references/references.module').then( m => m.ReferencesModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'my-items',
    loadChildren: () => import('./shared/modules/my-tasks-tickets/my-tasks-tickets.module').then( m => m.MyTasksTicketsModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'workflow-management',
    loadChildren: () => import('./components/workflows/workflows.module').then( m => m.WorkflowsModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'role-management',
    loadChildren: () => import('./components/roles/roles.module').then( m => m.RolesModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'data-extracts',
    loadChildren: () => import('./components/data-extracts/data-extracts.module').then( m => m.DataExtractsModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'calendar',
    loadChildren: () => import('./components/project-calendar/project-calendar.module').then( m => m.ProjectCalendarModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'todos',
    loadChildren: () => import('./components/todos/todos.module').then( m => m.TodosModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'outages',
    loadChildren: () => import('./components/outages/outage.module').then( m => m.OutageModule),
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'**',
    component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
