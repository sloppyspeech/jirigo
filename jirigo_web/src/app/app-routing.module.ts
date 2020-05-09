import { ViewEditTicketsComponent } from './components/tickets/view-edit-tickets/view-edit-tickets.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent  } from './components/login/login.component';
import { LogoutComponent  } from './components/logout/logout.component';
import { CreateTicketComponent  } from './components/tickets/create-ticket/create-ticket.component';
import { ListTicketsComponent  } from './components/tickets/list-tickets/list-tickets.component';
import { CreateProjectComponent } from './components/projects/create-project/create-project.component';
import { ListProjectsComponent  } from './components/projects/list-projects/list-projects.component';
import { RegisterComponent  } from './components/register/register.component';
import { ChangeProjectComponent  } from './components/projects/change-project/change-project.component';
import { AuthGuardService as AuthGuard } from './components/auth/auth-guard.service';

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
    path:'register',
    component:RegisterComponent
  },
  {
    path:'change-project',
    component:ChangeProjectComponent
  },
  {
    path:'create-ticket',
    component:CreateTicketComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'list-tickets',
    component:ListTicketsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'view-edit-tickets/:ticket_no',
    component:ViewEditTicketsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'view-edit-ticket',
    component:ViewEditTicketsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'list-projects',
    component:ListProjectsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'create-project',
    component:CreateProjectComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
