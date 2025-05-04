import { Routes } from '@angular/router';
import {
  artHistoryJobsPath,
  beyondPath,
  flipPath,
  leavingPath,
} from './core/constants/routing.constants';
import { BeyondResolver } from './projects/beyond/beyond-resolver';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  {
    path: 'main',
    loadComponent: () =>
      import('./landing/landing.component').then((c) => c.LandingComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/project.component').then((c) => c.ProjectComponent),
    children: [
      {
        path: flipPath,
        loadComponent: () =>
          import('./projects/flip/flip.component').then((c) => c.FlipComponent),
      },
      {
        path: beyondPath,
        loadComponent: () =>
          import('./projects/beyond/beyond.component').then(
            (c) => c.BeyondComponent
          ),
        resolve: {
          data: BeyondResolver,
        },
      },
      {
        path: artHistoryJobsPath,
        loadComponent: () =>
          import('./projects/art-history-jobs/art-history-jobs.component').then(
            (c) => c.ArtHistoryJobsComponent
          ),
      },
      {
        path: '**',
        redirectTo: '/main',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./blog/blog.component').then((c) => c.BlogComponent),
    children: [
      {
        path: leavingPath,
        loadComponent: () =>
          import('./blog/leaving/leaving.component').then(
            (c) => c.LeavingComponent
          ),
      },
      {
        path: '**',
        redirectTo: '/main',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/main',
  },
];
