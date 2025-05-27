import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PROJECTS } from '../core/constants/projects.constants';
import { SECTIONS } from '../core/constants/sections.constants';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsComponent } from './projects/projects.component';

@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    NavbarComponent,
    AboutComponent,
    ProjectsComponent,
    ContactComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  @ViewChild('about', { read: ElementRef }) aboutRef!: ElementRef;
  @ViewChild('projects', { read: ElementRef }) projectsRef!: ElementRef;
  @ViewChild('contact', { read: ElementRef }) contactRef!: ElementRef;
  projects = PROJECTS;
  sections = SECTIONS;
  navbarHeightAndOffset = 66;

  scrollToSection(section: SECTIONS | 'top'): void {
    if (section === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let sectionRef: ElementRef | null = null;
    switch (section) {
      case SECTIONS.ABOUT:
        sectionRef = this.aboutRef;
        break;
      case SECTIONS.PROJECTS:
        sectionRef = this.projectsRef;
        break;
      case SECTIONS.CONTACT:
        sectionRef = this.contactRef;
        break;
      default:
        console.warn(`Unknown section: ${section}`);
    }
    if (sectionRef) {
      const y =
        sectionRef.nativeElement.getBoundingClientRect().top +
        window.scrollY -
        this.navbarHeightAndOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
