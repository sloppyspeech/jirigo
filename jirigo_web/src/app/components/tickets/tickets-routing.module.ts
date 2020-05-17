import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTicketComponent} from  './create-ticket/create-ticket.component';
import { IssueDetailsComponent} from  './issue-details/issue-details.component';
import { ListTicketsComponent} from  './list-tickets/list-tickets.component';
import { TicketAuditComponent} from  './ticket-audit/ticket-audit.component';
import { TicketCommentsComponent} from  './ticket-comments/ticket-comments.component';
import { ViewEditTicketsComponent} from  './view-edit-tickets/view-edit-tickets.component';

const routes: Routes = [
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
    path:'**',
    component:ListTicketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
