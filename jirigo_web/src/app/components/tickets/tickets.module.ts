import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TicketsRoutingModule } from './tickets-routing.module';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule  } from 'primeng/autocomplete';
import { DialogModule } from "primeng/dialog";
import { CardModule  } from 'primeng/card';
import { ToastModule  } from 'primeng/toast';
import { SelectButtonModule  } from 'primeng/selectbutton';
import { QuillModule  } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule  } from 'primeng/calendar';
import { ContextMenuModule  } from 'primeng/contextmenu';

import { NgxSpinnerModule  } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CreateTicketComponent} from  './create-ticket/create-ticket.component';
import { IssueDetailsComponent} from  './issue-details/issue-details.component';
import { ListTicketsComponent} from  './list-tickets/list-tickets.component';
import { TicketAuditComponent} from  './ticket-audit/ticket-audit.component';
import { TicketCommentsComponent} from  './ticket-comments/ticket-comments.component';
import { ViewEditTicketsComponent} from  './view-edit-tickets/view-edit-tickets.component';
import { ModalConfirmModule } from './../../shared/modules/modal-confirm/modal-confirm.module';

@NgModule({
  declarations: [
    CreateTicketComponent,
    IssueDetailsComponent,
    ListTicketsComponent,
    TicketAuditComponent,
    TicketCommentsComponent,
    ViewEditTicketsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TicketsRoutingModule,
    TableModule,
    AutoCompleteModule,
    DialogModule,
    CardModule,
    ToastModule,
    QuillModule,
    NgxSpinnerModule,
    NgbModule,
    ButtonModule,
    SelectButtonModule,
    CalendarModule,
    FontAwesomeModule,
    ContextMenuModule,
    ModalConfirmModule
  ]
})
export class TicketsModule { }
