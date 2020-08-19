import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutageComponent } from './outage.component';

const routes: Routes = [
  {
    'path':'outage',
    'component':OutageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutageRoutingModule { }
