import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from './dashbourd.component';
import { SharedModule } from '../../shared/shared.module';
import { ChartsWidget1Component } from './charts-widget1/charts-widget1.component';

@NgModule({
  declarations: [DashboardComponent, ChartsWidget1Component],
  imports: [
    CommonModule,
    NgApexchartsModule,
    NgbDatepickerModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ]),
    NgxSkeletonLoaderModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class DashboardModule { }
