import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PROJECTS } from '../core/constants/projects.constants';
import { SECTIONS } from '../core/constants/sections.constants';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsTableComponent } from './projects-table/projects-table.component';

@Component({
    selector: 'app-landing',
    imports: [
        CommonModule,
        NavbarComponent,
        AboutComponent,
        ProjectsTableComponent,
        ContactComponent,
    ],
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  projects = PROJECTS;
  sections = SECTIONS;
}
