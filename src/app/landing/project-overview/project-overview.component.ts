import { Component, Input } from '@angular/core';
import { Project } from 'src/app/core/models/project.model';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
})
export class ProjectOverviewComponent {
  @Input() project: Project;

  isProject(title: string): boolean {
    return this.project.title === title;
  }

  getTextFromLabel(label: string): string[] {
    return Array.isArray(this.project[label])
      ? this.project[label]
      : [this.project[label]];
  }
}
