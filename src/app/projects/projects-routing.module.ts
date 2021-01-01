import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlipComponent } from './flip/flip.component';
import { ProjectComponent } from './project.component';
import { BeyondComponent } from './beyond/beyond.component';

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
