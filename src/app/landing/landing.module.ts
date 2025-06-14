import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectOverviewComponent } from './projects/project-overview/project-overview.component';
import { ProjectsTableComponent } from './projects/projects-table/projects-table.component';

@NgModule({
  imports: [
    AboutComponent,
    LandingRoutingModule,
    NavbarComponent,
    LandingComponent,
    ProjectsTableComponent,
    ProjectOverviewComponent,
    ContactComponent,
  ],
  exports: [
    AboutComponent,
    NavbarComponent,
    LandingComponent,
    ProjectsTableComponent,
    ProjectOverviewComponent,
    ContactComponent,
  ],
})
export class LandingModule {}
