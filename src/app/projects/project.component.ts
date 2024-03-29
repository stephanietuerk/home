import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { projectNavbarId } from '../core/constants/dom.constants';
import { Project } from '../core/models/project.model';
import { getProjectFromURL } from '../core/utilities/route.utils';

@Component({
  selector: 'app-project',
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
