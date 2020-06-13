import { HomepageComponent } from './homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard  } from '../../services/authentication/auth-guard.service';
import { RoleGuardService as RoleGuard  } from '../../services/authorization/role-guard.service';


const routes: Routes = [
  {
    path:'',
    component:HomepageComponent,
    canActivate:[AuthGuard,RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
