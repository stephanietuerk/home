import { Component, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { AboutComponent } from './about/about.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit {
  selectedPortal: Portal<any>;
  aboutPortal: ComponentPortal<AboutComponent>;
  projectListPortal: ComponentPortal<ProjectListComponent>;

  constructor() {}

  ngAfterViewInit() {
    this.aboutPortal = new ComponentPortal(AboutComponent);
    this.projectListPortal = new ComponentPortal(ProjectListComponent);
  }

  onNavSelection(selection: string) {
    switch (selection) {
      case 'about':
        this.selectedPortal = this.aboutPortal;
        break;
      case 'projects':
        this.selectedPortal = this.projectListPortal;
        break;
      default:
        this.selectedPortal = null;
    }
  }
}
