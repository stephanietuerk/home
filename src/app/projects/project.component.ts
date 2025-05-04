import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { projectNavbarId } from '../core/constants/dom.constants';
import { Project } from '../core/models/project.model';
import { getProjectFromURL } from '../core/utilities/route.utils';
import { ContentNavbarComponent } from '../shared/components/content-navbar/content-navbar.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ContentNavbarComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  hostDirectives: [CdkScrollable],
})
export class ProjectComponent implements OnInit {
  project: Project;
  navbarId = projectNavbarId;

  constructor(private router: Router) {}

  ngOnInit() {
    this.setProject();
  }

  setProject() {
    this.project = getProjectFromURL(this.router.url);
  }
}
