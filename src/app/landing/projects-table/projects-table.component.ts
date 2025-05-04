import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animations } from 'src/app/core/constants/animations.constants';
import { Project } from 'src/app/core/models/project.model';
import { PROJECTS } from '../../core/constants/projects.constants';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { HighlightRowOnHoverDirective } from '../../shared/directives/highlight-row-on-hover.directive';
import { ProjectOverviewComponent } from '../project-overview/project-overview.component';

@Component({
  selector: 'app-projects-table',
  standalone: true,
  imports: [
    CommonModule,
    ProjectOverviewComponent,
    SvgIconComponent,
    HighlightRowOnHoverDirective,
  ],
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [animations.slide('project-overview-component')],
})
export class ProjectsTableComponent implements OnInit {
  sections: any;
  projects = PROJECTS;
  expanded: { [index: string]: boolean };

  ngOnInit(): void {
    this.initializeState();
  }

  initializeState(): void {
    this.expanded = this.projects.reduce((state, project) => {
      state[project.id] = false;
      return state;
    }, {});
  }

  getTitle(project: Project): string {
    const asterisk = project.professional ? '*' : '';
    return project.title + asterisk;
  }

  toggleDescription(projectId): void {
    this.expanded[projectId] = !this.expanded[projectId];
  }

  getIcon(projectId): string {
    return this.expanded[projectId] ? 'row-arrow-up' : 'row-arrow-down';
  }
}
