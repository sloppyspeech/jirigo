import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { AssignWorkflowComponent } from './assign-workflow/assign-workflow.component';
import { EditWorkflowComponent } from './edit-workflow/edit-workflow.component';


const routes: Routes = [
{
  path:'create-workflow',
  component:CreateWorkflowComponent
},
{
  path:'edit-workflow',
  component:EditWorkflowComponent
},
{
  path:'assign-workflow',
  component:AssignWorkflowComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
