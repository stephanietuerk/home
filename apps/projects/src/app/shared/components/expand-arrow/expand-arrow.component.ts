import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-expand-arrow',
  imports: [],
  templateUrl: './expand-arrow.component.html',
  styleUrl: './expand-arrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandArrowComponent {
  @Input() hovered: boolean = false;
  @Input() expanded: boolean = false;
  @Input() compact: boolean = false;
}
