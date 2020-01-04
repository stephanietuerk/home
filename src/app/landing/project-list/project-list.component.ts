import {
  PROJECTS_METADATA,
  ProjectMetaData
} from './../../core/constants/projects.constants';
import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/core/models/project.model';
import { PROJECTS } from 'src/app/core/constants/projects.constants';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];
  projectsMetaData: ProjectMetaData[];

  constructor() {}

  ngOnInit() {
    this.projects = PROJECTS;
    this.projectsMetaData = PROJECTS_METADATA;
  }

  getCellText(text) {
    return Array.isArray(text) ? text.join(', ') : text;
  }
}
