import { Routes } from '@angular/router';
import {
  artHistoryJobsId,
  beyondId,
  federalDataPlatformId,
  flipId,
  leavingId,
} from './core/constants/routing.constants';
import { BeyondResolver } from './projects/beyond/beyond-resolver';
import { PROJECTS } from './projects/projects.constants';

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
        path: flipId,
        data: { project: PROJECTS.find((p) => p.id === flipId) },
        loadComponent: () =>
          import('./projects/flip/flip.component').then((c) => c.FlipComponent),
      },
      {
        path: beyondId,
        data: { project: PROJECTS.find((p) => p.id === beyondId) },
        loadComponent: () =>
          import('./projects/beyond/beyond.component').then(
            (c) => c.BeyondComponent
          ),
        resolve: {
          data: BeyondResolver,
        },
      },
      {
        path: artHistoryJobsId,
        data: { project: PROJECTS.find((p) => p.id === artHistoryJobsId) },
        loadComponent: () =>
          import('./projects/art-history-jobs/art-history-jobs.component').then(
            (c) => c.ArtHistoryJobsComponent
          ),
      },
      {
        path: leavingId,
        data: { project: PROJECTS.find((p) => p.id === leavingId) },
        loadComponent: () =>
          import('./projects/leaving/leaving.component').then(
            (c) => c.LeavingComponent
          ),
      },
      {
        path: federalDataPlatformId,
        data: { project: PROJECTS.find((p) => p.id === federalDataPlatformId) },
        loadComponent: () =>
          import(
            './projects/federal-data-platform/federal-data-platform.component'
          ).then((c) => c.FederalDataPlatformComponent),
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
