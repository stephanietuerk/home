import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectsTableComponent } from '../projects-table/projects-table.component';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsTableComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
