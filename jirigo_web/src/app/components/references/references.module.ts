import { ReferencesComponent } from './references.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { ReferencesRoutingModule } from './references-routing.module';

import { TableModule} from 'primeng/table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateReferenceComponent } from './create-reference/create-reference.component';
import { EditReferenceComponent } from './edit-reference/edit-reference.component';


@NgModule({
  declarations: [ ReferencesComponent, CreateReferenceComponent, EditReferenceComponent],
  imports: [
    CommonModule,
    ReferencesRoutingModule,
    TableModule,
    NgxSpinnerModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputSwitchModule,
    FontAwesomeModule
  ]
})
export class ReferencesModule { }
