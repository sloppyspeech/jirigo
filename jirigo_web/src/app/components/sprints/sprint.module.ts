import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { CreateSprintComponent  } from './create-sprint/create-sprint.component';
import { ListSprintsComponent } from './list-sprints/list-sprints.component';
import { SprintRoutingModule } from './sprint-routing.module';

import { TicketDetailsService   } from '../../services/tickets/ticket-details.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PickListModule  } from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule  } from 'primeng/inputtext';
import { ButtonModule  } from 'primeng/button';
import { TableModule  } from 'primeng/table';
import { CalendarModule }  from 'primeng/calendar';
import { DropdownModule} from 'primeng/dropdown';

import { NgxSpinnerModule  } from 'ngx-spinner';
import { EditSprintsComponent } from './edit-sprints/edit-sprints.component';


@NgModule({
  declarations: [CreateSprintComponent, ListSprintsComponent, EditSprintsComponent],
  imports: [
    CommonModule,
    SprintRoutingModule,
    PickListModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    NgxSpinnerModule,
    NgbModule
  ],
  providers:[TicketDetailsService]
})
export class SprintModule { }
