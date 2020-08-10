import { GlobalSearchModule } from './shared/modules/global-search/global-search.module';
import { LineChartModule } from './shared/modules/charts/line-chart/line-chart.module';
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
import { DropdownModule} from 'primeng/dropdown'
import { ChartModule} from 'primeng/chart';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SelectUserComponent } from './components/common/select-user/select-user.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MenuComponent } from './components/menu/menu.component';
import { DebugComponent } from './components/debug/debug.component';
import { UtilsService  } from './services/shared/utils.service';

import { ModalConfirmModule} from './shared/modules/modal-confirm/modal-confirm.module';
import { DataExtractsComponent } from './components/data-extracts/data-extracts.component';
import { ClickToEditModule } from './shared/modules/click-to-edit/click-to-edit.module';
import { ColorPickerModule } from './shared/modules/color-picker/color-picker.module';
import { BarChartModule } from './shared/modules/charts/bar-chart/bar-chart.module';
import { AreaChartModule } from './shared/modules/charts/area-chart/area-chart.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SelectUserComponent,
    RegisterComponent,
    LogoutComponent,
    MenuComponent,
    DebugComponent,
    DataExtractsComponent
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
    DropdownModule,
    FontAwesomeModule,
    ChartModule,
    ModalConfirmModule,
    ClickToEditModule,
    ColorPickerModule,
    BarChartModule,
    LineChartModule,
    GlobalSearchModule,
    AreaChartModule
  ],
  providers: [UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
