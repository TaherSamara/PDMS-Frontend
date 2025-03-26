import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { Error503Component } from './error503/error503.component';
import { ErrorComponent } from './error.component';
import { Error403Component } from './error403/error403.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [
      {
        path: '403',
        component: Error403Component,
        title: '403 Error | Paltel'
      },
      {
        path: '404',
        component: Error404Component,
        title: '404 Error | Paltel'
      },
      {
        path: '500',
        component: Error500Component,
        title: '500 Error | Paltel'
      },
      {
        path: '503',
        component: Error503Component,
        title: '503 Error | Paltel'
      },
      { path: '', redirectTo: '404', pathMatch: 'full' },
      { path: '**', redirectTo: '404', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule { }
