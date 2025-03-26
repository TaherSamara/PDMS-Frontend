import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from './dash.component';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RedirectComponent } from './redirect.component';

const routes: Routes = [
  {
    path: '',
    component: DashComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [PermissionGuard],
        loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
        title: 'Dashboard | Paltel',
        data: { permissions: ['DASHBOARD'] }
      },
      {
        path: 'users',
        canActivate: [PermissionGuard],
        loadChildren: () => import('./pages/users/users.module').then((m) => m.UserModule),
        title: "Users | Paltel",
        data: { permissions: ['USERS'] }
      },
      {
        path: 'devices',
        canActivate: [PermissionGuard],
        loadChildren: () => import('./pages/devices/devices.module').then((m) => m.DevicesModule),
        title: "Users | Paltel",
        data: { permissions: ['USERS'] }
      },
      {
        path: 'map',
        canActivate: [PermissionGuard],
        loadChildren: () => import('./pages/map/map.module').then((m) => m.MapModule),
        title: "Map | Paltel",
        data: { permissions: ['MAP'] }
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then((m) => m.AccountModule),
        title: 'Account | Paltel',
      },
      {
        path: 'settings',
        canActivate: [PermissionGuard],
        loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
        title: 'Settings | Paltel',
        data: { permissions: ['SETTINGS'] }
      },
      { path: '', component: RedirectComponent, pathMatch: 'full' },
      { path: '**', component: RedirectComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashRoutingModule { }
