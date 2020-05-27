import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { EditWorkflowComponent } from './edit-workflow/edit-workflow.component';


const routes: Routes = [
{
  path:'create-workflow',
  component:CreateWorkflowComponent
},
{
  path:'edit-workflow',
  component:EditWorkflowComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
