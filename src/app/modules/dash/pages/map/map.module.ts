import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PermissionGuard } from 'src/app/modules/auth/guards/permission.guard';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [PermissionGuard],
        component: MapComponent,
        data: { permissions: ['MAP'] }
      },
      { path: '', component: MapComponent, pathMatch: 'full' },
      { path: '**', component: MapComponent }
    ]),
    NgxSkeletonLoaderModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class MapModule { }
