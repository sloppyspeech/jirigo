import { DataExtractsComponent } from './data-extracts.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';


const routes: Routes = [{
  path:'',
  component:DataExtractsComponent,
  canActivate:[AuthGuard,RoleGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataExtractsRoutingModule { }
