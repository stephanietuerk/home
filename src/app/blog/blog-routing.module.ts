import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { leavingPath } from '../core/constants/routing.constants';
import { BlogComponent } from './blog.component';
import { LeavingComponent } from './leaving/leaving.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    children: [
      {
        path: leavingPath,
        component: LeavingComponent,
      },
      {
        path: 'leavingacademia', // old path name
        redirectTo: leavingPath,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/main',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class BlogRoutingModule {}
