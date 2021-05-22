import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeyondResolver } from './beyond/beyond-resolver';
import { BeyondComponent } from './beyond/beyond.component';
import { FlipComponent } from './flip/flip.component';
import { LeavingComponent } from './leaving/leaving.component';
import { ProjectComponent } from './project.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectComponent,
        children: [
            {
                path: 'flipthedistrict',
                component: FlipComponent,
            },
            {
                path: 'beyondthecountyline',
                component: BeyondComponent,
                resolve: {
                    data: BeyondResolver,
                },
            },
            {
                path: 'leavingacademia',
                component: LeavingComponent,
            },
            {
                path: '**',
                redirectTo: '/landing',
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
