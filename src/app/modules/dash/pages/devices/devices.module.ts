import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { DevicesComponent } from './devices.component';
import { PermissionGuard } from 'src/app/modules/auth/guards/permission.guard';
import player from 'lottie-web';
import { AddEditComponent } from './add-edit/add-edit.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [DevicesComponent, AddEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [PermissionGuard],
        component: DevicesComponent,
        data: { permissions: ['VIEW_DEVICES'] }
      },
      {
        path: ':status',
        canActivate: [PermissionGuard],
        component: DevicesComponent,
        data: { permissions: ['VIEW_DEVICES'] }
      },
      { path: '', component: DevicesComponent, pathMatch: 'full' },
      { path: '**', component: DevicesComponent }
    ]),
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    SharedModule,
  ]
})
export class DevicesModule { }
