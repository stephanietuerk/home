import { LandingPageComponent } from './landing/landing-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsPageComponent } from './projects/projects-page.component';


const routes: Routes = [

    {
        path: 'home',
        component: LandingPageComponent
    },
    {
        path: 'projects',
        component: ProjectsPageComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes), CommonModule],
    exports: [RouterModule]
})
export class RoutingModule {}