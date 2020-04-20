import { ViewEditTicketsComponent } from './components/tickets/view-edit-tickets/view-edit-tickets.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent  } from './components/login/login.component';
import { CreateTicketComponent  } from './components/tickets/create-ticket/create-ticket.component';
import { ListTicketsComponent  } from './components/tickets/list-tickets/list-tickets.component';
import { CreateProjectComponent } from './components/projects/create-project/create-project.component';
import { ListProjectsComponent  } from './components/projects/list-projects/list-projects.component';


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
    path:'create-ticket',
    component:CreateTicketComponent
  },
  {
    path:'list-tickets',
    component:ListTicketsComponent
  },
  {
    path:'view-edit-tickets/:ticket_no',
    component:ViewEditTicketsComponent
  },
  {
    path:'view-edit-ticket',
    component:ViewEditTicketsComponent
  },
  {
    path:'list-projects',
    component:ListProjectsComponent
  },
  {
    path:'create-project',
    component:CreateProjectComponent
  },
  {
    path:'create-task',
    loadChildren: () => import('./components/tasks/tasks.module').then( m => m.TasksModule)
  },
  {
    path:'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then( m => m.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
