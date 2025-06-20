import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectArrowComponent } from '../../shared/components/project-arrow/project-arrow.component';

@Component({
  selector: 'app-federal-data-platform',
  imports: [CommonModule, ProjectArrowComponent],
  templateUrl: './federal-data-platform.component.html',
  styleUrl: './federal-data-platform.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FederalDataPlatformComponent {
  scorecardHovered: boolean = false;
  coresetHovered: boolean = false;
}
