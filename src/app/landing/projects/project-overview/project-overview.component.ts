import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from 'src/app/core/models/project.model';
import { ProjectArrowComponent } from '../../../shared/components/project-arrow/project-arrow.component';

@Component({
  selector: 'app-project-overview',
  imports: [CommonModule, RouterModule, ProjectArrowComponent],
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
})
export class ProjectOverviewComponent {
  @Input() project: Project;
  hovered: Record<string, boolean> = {};

  isProject(title: string): boolean {
    return this.project.title === title;
  }

  getTextFromLabel(label: string): string[] {
    return Array.isArray(this.project[label])
      ? this.project[label]
      : [this.project[label]];
  }

  setHovered(key: string, value: boolean): void {
    this.hovered[this.getSanitizedKey(key)] = value;
  }

  getSanitizedKey(key: string): string {
    return key.replace(/ /g, '-').toLowerCase();
  }
}
