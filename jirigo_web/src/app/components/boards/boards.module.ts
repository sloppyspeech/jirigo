import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BoardsRoutingModule } from './boards-routing.module';
import {ScrumBoardComponent} from './scrum/scrum-board/scrum-board.component';


@NgModule({
  declarations: [ScrumBoardComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    FontAwesomeModule
  ]
})
export class BoardsModule { }
