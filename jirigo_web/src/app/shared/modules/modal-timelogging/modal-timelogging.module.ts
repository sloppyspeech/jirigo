import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTimeloggingComponent } from './modal-timelogging.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [ModalTimeloggingComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ModalTimeloggingComponent]
})
export class ModalTimeloggingModule { }
