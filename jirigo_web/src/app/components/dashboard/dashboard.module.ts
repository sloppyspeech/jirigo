import { LineChartModule } from './../../shared/modules/charts/line-chart/line-chart.module';
import { BarChartModule } from './../../shared/modules/charts/bar-chart/bar-chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent  }  from './dashboard.component';
import {ChartModule} from 'primeng/chart';
import { SprintTasksDashboardComponent } from './sprint-tasks-dashboard/sprint-tasks-dashboard.component';
@NgModule({
  declarations: [DashboardComponent, SprintTasksDashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    ChartModule,
    BarChartModule,
    LineChartModule
  ]
})
export class DashboardModule { }
