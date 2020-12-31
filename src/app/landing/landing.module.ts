import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { ProjectsTableComponent } from './projects-table/projects-table.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [CommonModule, LandingRoutingModule, SharedModule],
    declarations: [LandingComponent, NavbarComponent, AboutComponent, ProjectsTableComponent, ProjectOverviewComponent],
})
export class LandingModule {}
