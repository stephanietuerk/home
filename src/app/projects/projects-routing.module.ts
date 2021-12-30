import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { artHistoryJobsPath, beyondPath, flipPath } from '../core/constants/routing.constants';
import { ArtHistoryJobsComponent } from './art-history-jobs/art-history-jobs.component';
import { BeyondResolver } from './beyond/beyond-resolver';
import { BeyondComponent } from './beyond/beyond.component';
import { FlipComponent } from './flip/flip.component';
import { ProjectComponent } from './project.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectComponent,
        children: [
            {
                path: flipPath,
                component: FlipComponent,
            },
            {
                path: beyondPath,
                component: BeyondComponent,
                resolve: {
                    data: BeyondResolver,
                },
            },
            {
                path: artHistoryJobsPath,
                component: ArtHistoryJobsComponent,
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
export class ProjectsRoutingModule {}
