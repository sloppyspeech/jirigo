import { ClickToEditModule } from './../../shared/modules/click-to-edit/click-to-edit.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalConfirmModule } from './../../shared/modules/modal-confirm/modal-confirm.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BoardsRoutingModule } from './boards-routing.module';
import {ScrumBoardComponent} from './scrum/scrum-board/scrum-board.component';


@NgModule({
  declarations: [ScrumBoardComponent],
  imports: [
    CommonModule,
    BoardsRoutingModule,
    FontAwesomeModule,
    ModalConfirmModule,
    NgxSpinnerModule,
    ClickToEditModule,
    NgbModule
  ]
})
export class BoardsModule { }
