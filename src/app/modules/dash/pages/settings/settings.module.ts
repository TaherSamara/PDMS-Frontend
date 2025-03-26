import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './general/general.component';
import { RolesComponent } from './roles/roles.component';
import { AddRoleComponent } from './roles/add/add.component';
import { EditRoleComponent } from './roles/edit/edit.component';
import { PermissionGuard } from 'src/app/modules/auth/guards/permission.guard';
import { MapComponent } from './map/map.component';

@NgModule({
    declarations: [
        SettingsComponent,
        GeneralComponent,
        RolesComponent,
        AddRoleComponent,
        EditRoleComponent,
        MapComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettingsComponent,
                children: [
                    {
                        path: 'general',
                        component: GeneralComponent,
                        title: 'General Settings | Paltel'
                    },
                    {
                        path: 'map',
                        canActivate: [PermissionGuard],
                        component: MapComponent,
                        title: 'Map Management | Paltel',
                        data: { permissions: ['VIEW_MAP'] }
                    },
                    {
                        path: 'roles',
                        canActivate: [PermissionGuard],
                        component: RolesComponent,
                        title: 'Roles Management | Paltel',
                        data: { permissions: ['VIEW_ROLES'] }
                    },
                    { path: '', redirectTo: 'general', pathMatch: 'full' },
                    { path: '**', redirectTo: 'general' }
                ]
            }
        ]),
        NgxSkeletonLoaderModule,
        NgxPaginationModule,
        SharedModule,
    ]
})
export class SettingsModule { }
