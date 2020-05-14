import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeProjectComponent } from './change-project/change-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';


const routes: Routes = [
  {
    path:'change-project',
    component:ChangeProjectComponent
  },
  {
    path:'create-project',
    component:CreateProjectComponent
  },
  {
    path:'list-projects',
    component:ListProjectsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
