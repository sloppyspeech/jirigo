import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowsRoutingModule } from './workflows-routing.module';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditWorkflowComponent } from './edit-workflow/edit-workflow.component';

@NgModule({
  declarations: [CreateWorkflowComponent, EditWorkflowComponent],
  imports: [
    CommonModule,
    WorkflowsRoutingModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class WorkflowsModule { }
