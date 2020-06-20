import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { GenericTableComponent } from './generic-table.component';
import { NumToHhmiPipeModule } from './../pipes/num-to-hhmi.pipe.module';



@NgModule({
  declarations: [GenericTableComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    NumToHhmiPipeModule
  ],
  exports:[
    GenericTableComponent
  ]
})
export class GenericTableModule { }
