import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectsTableComponent } from './projects-table/projects-table.component';

@NgModule({
    imports: [CommonModule, LandingRoutingModule, SharedModule],
    declarations: [
        LandingComponent,
        NavbarComponent,
        AboutComponent,
        ProjectsTableComponent,
        ProjectOverviewComponent,
        ContactComponent,
    ],
})
export class LandingModule {}
