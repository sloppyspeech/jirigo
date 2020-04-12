import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule,FormGroup,FormBuilder  }  from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { CreateTicketComponent } from './components/tickets/create-ticket/create-ticket.component';
import { CreateProjectComponent  } from './components/projects/create-project/create-project.component';
import { CreateUserComponent  } from './components/users/create-user/create-user.component';
import { ListTicketsComponent } from './components/tickets/list-tickets/list-tickets.component';

import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule  } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';
import { ViewEditTicketsComponent } from './components/tickets/view-edit-tickets/view-edit-tickets.component';
import { QuillModule  } from 'ngx-quill';
import { NgxSpinnerModule  } from 'ngx-spinner';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IssueDetailsComponent } from './components/tickets/issue-details/issue-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateTicketComponent,
    CreateProjectComponent,
    CreateUserComponent,
    ListTicketsComponent,
    ViewEditTicketsComponent,
    HeaderComponent,
    FooterComponent,
    IssueDetailsComponent
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
    Ng2SmartTableModule,
    DataTablesModule,
    QuillModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
