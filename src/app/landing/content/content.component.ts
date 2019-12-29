import { LandingService } from './../landing.service';
import { Component, ViewEncapsulation, AfterViewInit, OnChanges } from '@angular/core';
import { Portal, ComponentPortal } from '@angular/cdk/portal';
import { AboutComponent } from '../about/about.component';
import { ProjectListComponent } from '../project-list/project-list.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements AfterViewInit {
  selectedContent: string;
  selectedPortal: Portal<any>;
  aboutPortal: ComponentPortal<AboutComponent>;
  projectListPortal: ComponentPortal<ProjectListComponent>;

  constructor(public landingService: LandingService) {
    this.landingService.navSelectionObs.subscribe((selection) => {
      this.selectedContent = selection;
    });
  }

  ngAfterViewInit() {
    this.aboutPortal = new ComponentPortal(AboutComponent);
    this.projectListPortal = new ComponentPortal(ProjectListComponent);
  }

  getPortal() {
    switch (this.selectedContent) {
      case 'about':
        this.selectedPortal = this.aboutPortal;
        return this.aboutPortal;
      case 'projects':
        this.selectedPortal = this.projectListPortal;
        return this.projectListPortal;
      default:
        this.selectedPortal = null;
        return null;
    }
  }

  closePanel() {
    this.selectedPortal = null;
    this.landingService.updateSelection(null);
  }
}

