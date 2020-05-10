import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule,FormGroup,FormBuilder  }  from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { NgxSpinnerModule  } from 'ngx-spinner';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { QuillModule  } from 'ngx-quill';

import { TabViewModule  } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule  } from 'primeng/calendar';
import { SelectButtonModule  } from 'primeng/selectbutton';
import { AutoCompleteModule  } from 'primeng/autocomplete';
import { DialogModule } from "primeng/dialog";
import { CardModule  } from 'primeng/card';
import { ToastModule  } from 'primeng/toast';
import { DragDropModule  } from 'primeng/dragdrop';
import { PanelModule  } from 'primeng/panel';
import { DynamicDialogModule  } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LoginComponent } from './components/login/login.component';
import { CreateTicketComponent } from './components/tickets/create-ticket/create-ticket.component';
import { CreateProjectComponent  } from './components/projects/create-project/create-project.component';
import { ListTicketsComponent } from './components/tickets/list-tickets/list-tickets.component';
import { ViewEditTicketsComponent } from './components/tickets/view-edit-tickets/view-edit-tickets.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IssueDetailsComponent } from './components/tickets/issue-details/issue-details.component';
import { TicketCommentsComponent } from './components/tickets/ticket-comments/ticket-comments.component';
import { SelectUserComponent } from './components/common/select-user/select-user.component';
import { TicketAuditComponent } from './components/tickets/ticket-audit/ticket-audit.component';
import { ListProjectsComponent } from './components/projects/list-projects/list-projects.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ChangeProjectComponent } from './components/projects/change-project/change-project.component';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateTicketComponent,
    CreateProjectComponent,
    ListTicketsComponent,
    ViewEditTicketsComponent,
    HeaderComponent,
    FooterComponent,
    IssueDetailsComponent,
    TicketCommentsComponent,
    SelectUserComponent,
    TicketAuditComponent,
    ListProjectsComponent,
    RegisterComponent,
    LogoutComponent,
    ChangeProjectComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
    NgbModule,
    DataTablesModule,
    QuillModule.forRoot(),
    NgxSpinnerModule,
    TabViewModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    SelectButtonModule,
    AutoCompleteModule,
    DialogModule,
    CardModule,
    ToastModule,
    DragDropModule,
    PanelModule,
    DynamicDialogModule,
    RadioButtonModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
