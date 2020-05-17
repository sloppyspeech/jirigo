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
    canActivate:[AuthGuard]
  },
  {
    path:'register',
    component:RegisterComponent
  },

  {
    path:'tickets',
    loadChildren: () => import('./components/tickets/tickets.module').then( m => m.TicketsModule),
    canActivate:[AuthGuard]
  },
  {
    path:'projects',
    loadChildren: () => import('./components/projects/projects.module').then( m => m.ProjectsModule),
    canActivate:[AuthGuard]
  },
  {
    path:'tasks',
    loadChildren: () => import('./components/tasks/tasks.module').then( m => m.TasksModule),
    canActivate:[AuthGuard]
  },
  {
    path:'boards',
    loadChildren:() => import ('./components/boards/boards.module').then(m=> m.BoardsModule),
    canActivate:[AuthGuard]
  },
  {
    path:'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then( m => m.DashboardModule),
    canActivate:[AuthGuard]
  },
  {
    path:'sprints',
    loadChildren: () => import('./components/sprints/sprint.module').then( m => m.SprintModule),
    canActivate:[AuthGuard]
  },
  {
    path:'user-management',
    loadChildren: () => import('./components/users/users.module').then( m => m.UsersModule),
    canActivate:[AuthGuard]
  },
  {
    path:'refdata-management',
    loadChildren: () => import('./components/references/references.module').then( m => m.ReferencesModule),
    canActivate:[AuthGuard]
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
