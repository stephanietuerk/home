import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animations } from 'src/app/core/constants/animations.constants';
import { PROJECTS } from '../../core/constants/projects.constants';
import { ExpandArrowComponent } from '../../shared/components/expand-arrow/expand-arrow.component';
import { ProjectOverviewComponent } from '../project-overview/project-overview.component';

@Component({
  selector: 'app-projects-table',
  imports: [CommonModule, ProjectOverviewComponent, ExpandArrowComponent],
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [animations.slide('project-overview-component')],
})
export class ProjectsTableComponent implements OnInit {
  sections: any;
  projects = PROJECTS;
  expanded: { [index: string]: boolean } = {};
  hovered: { [index: string]: boolean } = {};

  ngOnInit(): void {
    this.initializeState();
  }

  initializeState(): void {
    this.expanded = this.projects.reduce((state, project) => {
      state[project.id] = false;
      return state;
    }, {});
  }

  toggleDescription(projectId): void {
    this.expanded[projectId] = !this.expanded[projectId];
  }

  getIcon(projectId): string {
    return this.expanded[projectId] ? 'row-arrow-up' : 'row-arrow-down';
  }

  setHovered(projectId: string, hovered: boolean): void {
    this.hovered[projectId] = hovered;
  }
}
