import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScrumBoardComponent} from './scrum/scrum-board/scrum-board.component';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';

const routes: Routes = [
  {
    path:'scrum/:sprint_id',
    component:ScrumBoardComponent,
    canActivate:[AuthGuard,RoleGuard]
  },
  {
    path:'scrum',
    component:ScrumBoardComponent,
    canActivate:[AuthGuard,RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardsRoutingModule { }
