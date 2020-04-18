import { ViewEditTicketsComponent } from './components/tickets/view-edit-tickets/view-edit-tickets.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent  } from './components/login/login.component';
import { CreateTicketComponent  } from './components/tickets/create-ticket/create-ticket.component';
import { ListTicketsComponent  } from './components/tickets/list-tickets/list-tickets.component';
import { CreateProjectComponent } from './components/projects/create-project/create-project.component';


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
    path:'create-project',
    component:CreateProjectComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
