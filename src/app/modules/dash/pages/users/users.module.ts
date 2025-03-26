import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { LottieModule } from 'ngx-lottie';
import { InviteComponent } from './invite/invite.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PermissionGuard } from 'src/app/modules/auth/guards/permission.guard';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    UsersComponent,
    AddComponent,
    EditComponent,
    InviteComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [PermissionGuard],
        component: UsersComponent,
        data: { permissions: ['VIEW_USERS'] }
      },
      {
        path: 'add-user',
        canActivate: [PermissionGuard],
        component: AddComponent,
        data: { permissions: ['ADD_USER'] }
      },
      {
        path: 'edit-user/:id',
        canActivate: [PermissionGuard],
        component: EditComponent,
        data: { permissions: ['EDIT_USER'] }
      },
      { path: '', component: UsersComponent, pathMatch: 'full' },
      { path: '**', component: UsersComponent }
    ]),
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    SharedModule,
    LottieModule.forRoot({ player: playerFactory })
  ]
})
export class UserModule { }
