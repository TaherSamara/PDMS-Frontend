import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';
import { SidebarComponent } from './components/side-bar/side-bar.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
    NgxSkeletonLoaderModule,
    SharedModule,
    FormsModule
  ],
  providers: []
})
export class DashModule { }
