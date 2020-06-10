import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTicketComponent} from  './create-ticket/create-ticket.component';
import { IssueDetailsComponent} from  './issue-details/issue-details.component';
import { ListTicketsComponent} from  './list-tickets/list-tickets.component';
import { TicketAuditComponent} from  './ticket-audit/ticket-audit.component';
import { TicketCommentsComponent} from  './ticket-comments/ticket-comments.component';
import { ViewEditTicketsComponent} from  './view-edit-tickets/view-edit-tickets.component';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';

const routes: Routes = [
  {
    path:'create-ticket',
    component:CreateTicketComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'list-tickets',
    component:ListTicketsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'view-edit-tickets/:ticket_no',
    component:ViewEditTicketsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'view-edit-tickets',
    component:ViewEditTicketsComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'view-edit-ticket',
    component:ViewEditTicketsComponent,
    canActivate:[AuthGuard,RoleGuard]
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
