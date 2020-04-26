import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSprintComponent  } from './create-sprint/create-sprint.component';
import { ListSprintsComponent  } from './list-sprints/list-sprints.component';
import { EditSprintsComponent  } from './edit-sprints/edit-sprints.component';
const routes: Routes = [
  {
    path:'create-sprint',
    component:CreateSprintComponent
  },
  {
    path:'list-sprints',
    component:ListSprintsComponent
  },
  {
    path:'edit-sprints/:sprint_id',
    component:EditSprintsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SprintRoutingModule { }
