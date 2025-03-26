import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { GeneralComponent } from './general/general.component';
import { PasswordsComponent } from './passwords/passwords.component';
import { AccountComponent } from './account.component';

@NgModule({
    declarations: [GeneralComponent, PasswordsComponent, AccountComponent],
    imports: [
        CommonModule,
        NgApexchartsModule,
        NgbDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    {
                        path: 'general',
                        component: GeneralComponent,
                        title: 'General Settings | Paltel'
                    },
                    {
                        path: 'passwords',
                        component: PasswordsComponent,
                        title: 'Password Management | Paltel'
                    },
                    { path: '', redirectTo: 'general', pathMatch: 'full' },
                    { path: '**', redirectTo: 'general' }
                ]
            }
        ]),
        NgxSkeletonLoaderModule,
        NgxPaginationModule,
        SharedModule,
        NgbModule
    ]
})
export class AccountModule { }
