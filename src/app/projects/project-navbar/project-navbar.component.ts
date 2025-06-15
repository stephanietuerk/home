import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectArrowComponent } from '../../shared/components/project-arrow/project-arrow.component';

@Component({
  selector: 'app-project-navbar',
  imports: [CommonModule, RouterModule, ProjectArrowComponent],
  templateUrl: './project-navbar.component.html',
  styleUrls: ['./project-navbar.component.scss'],
})
export class ProjectNavbarComponent {
  @Input() title: string;
  hovered: boolean = false;
}
