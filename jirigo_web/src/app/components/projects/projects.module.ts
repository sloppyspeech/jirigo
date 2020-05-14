import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ChangeProjectComponent } from './change-project/change-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';

import { DropdownModule} from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule} from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule  } from 'primeng/button';


import { NgxSpinnerModule  } from 'ngx-spinner';

@NgModule({
  declarations: [ChangeProjectComponent,CreateProjectComponent,ListProjectsComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    RadioButtonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    NgxSpinnerModule
  ]
})
export class ProjectsModule { }
