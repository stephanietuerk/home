import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { projectNavbarId } from '../core/constants/dom.constants';
import { Project } from '../core/models/project.model';
import { getProjectFromURL } from '../core/utilities/route.utils';
import { FormatForIdPipe } from '../shared/pipes/format-for-id/format-for-id.pipe';
import { ProjectNavbarComponent } from './project-navbar/project-navbar.component';

@Component({
  selector: 'app-project',
  imports: [
    CommonModule,
    RouterOutlet,
    ProjectNavbarComponent,
    FormatForIdPipe,
  ],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  hostDirectives: [CdkScrollable],
})
export class ProjectComponent implements OnInit {
  project: Project;
  navbarId = projectNavbarId;
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @HostBinding('class')
  get hostClass() {
    return getProjectFromURL(this.router.url).id || '';
  }

  ngOnInit() {
    this.setProject();
  }

  setProject() {
    this.project = getProjectFromURL(this.router.url);
  }
}
