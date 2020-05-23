import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTasksTicketsComponent} from './my-tasks-tickets.component';

const routes: Routes = [
  {
    path:'tickets',
    component:MyTasksTicketsComponent
  },
  {
    path:'tasks',
    component:MyTasksTicketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTasksTicketsRoutingModule { }
