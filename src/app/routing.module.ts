import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule) },
    { path: 'projects', loadChildren: () => import('./projects/projects.module').then((m) => m.ProjectsModule) },
    { path: 'blog', loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes), CommonModule],
    exports: [RouterModule],
})
export class RoutingModule {}
