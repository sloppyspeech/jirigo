import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmComponent} from './modal-confirm.component';


@NgModule({
  declarations: [ModalConfirmComponent],
  imports: [
    CommonModule
  ],
  exports:[ModalConfirmComponent]
})
export class ModalConfirmModule { }
