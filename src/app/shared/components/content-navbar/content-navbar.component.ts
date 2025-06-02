import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectArrowComponent } from '../project-arrow/project-arrow.component';

@Component({
  selector: 'app-content-navbar',
  imports: [CommonModule, RouterModule, ProjectArrowComponent],
  templateUrl: './content-navbar.component.html',
  styleUrls: ['./content-navbar.component.scss'],
})
export class ContentNavbarComponent {
  @Input() title: string;
  hovered: boolean = false;
}
