import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTaskComponent  }  from './create-task/create-task.component';
import { ListTasksComponent  }  from './list-tasks/list-tasks.component';
import { ViewEditTaskComponent  }  from './view-edit-task/view-edit-task.component';
import {  AuthGuardService as AuthGuard } from '../../services/authentication/auth-guard.service';

const routes: Routes = [
  {
   path:'create-task',
   component:CreateTaskComponent 
  },
  {
    path:'list-tasks',
    component:ListTasksComponent 
   },
   {
    path:'view-edit-task/:task_no',
    component:ViewEditTaskComponent ,
    canActivate:[AuthGuard]
   },
   {
     path:'**',
     component:ListTasksComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
