import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { QuillModule  } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TabViewModule  } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule  } from 'primeng/calendar';
import { SelectButtonModule  } from 'primeng/selectbutton';
import { AutoCompleteModule  } from 'primeng/autocomplete';
import { DialogModule } from "primeng/dialog";
import { CardModule  } from 'primeng/card';
import { ToastModule  } from 'primeng/toast';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgxSpinnerModule  } from 'ngx-spinner';
import { TasksRoutingModule } from './tasks-routing.module';

import { CreateTaskComponent  }  from './create-task/create-task.component';
import { ListTasksComponent  }  from './list-tasks/list-tasks.component';
import { ViewEditTaskComponent  }  from './view-edit-task/view-edit-task.component';
import { TaskDetailsComponent  } from './task-details/task-details.component';
import { TaskCommentsComponent } from './task-comments/tasks-comments.component';
import { AuditTaskComponent  } from './audit-task/audit-task.component';

@NgModule({
  declarations: [
    CreateTaskComponent,
    ListTasksComponent,
    ViewEditTaskComponent,
    TaskDetailsComponent,
    TaskCommentsComponent,
    AuditTaskComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    NgbModule,
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
    FontAwesomeModule
  ]
})
export class TasksModule { }
