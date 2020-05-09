import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScrumBoardComponent} from './scrum/scrum-board/scrum-board.component';

const routes: Routes = [
  {
    path:'scrum/:sprint_id',
    component:ScrumBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule { }
