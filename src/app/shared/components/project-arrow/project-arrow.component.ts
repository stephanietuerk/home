import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-arrow',
  imports: [],
  templateUrl: './project-arrow.component.html',
  styleUrl: './project-arrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectArrowComponent {
  @Input() hovered: boolean = false;
}
