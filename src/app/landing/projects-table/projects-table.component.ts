import {
  PROJECTS_METADATA,
  ProjectMetaData,
  PROJECTS
} from '../../core/constants/projects.constants';
import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/core/models/project.model';
import { SECTIONS } from 'src/app/core/constants/sections.constants';
import { ElementService } from 'src/app/core/services/element.service';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss']
})
export class ProjectsTableComponent implements OnInit {
    sections: any;
    projects: Project[];
    projectsMetaData: ProjectMetaData[];
    selected: number;

    constructor(public elementService: ElementService) {}

    ngOnInit() {
        this.sections = SECTIONS;
        this.projects = PROJECTS;
        this.projectsMetaData = PROJECTS_METADATA;
    }

    getCellText(text) {
        return Array.isArray(text) ? text.join(', ') : text;
    }
}
