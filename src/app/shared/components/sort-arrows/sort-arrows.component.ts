import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SortDirection } from 'src/app/core/enums/sort.enum';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-sort-arrows',
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './sort-arrows.component.html',
  styleUrls: ['./sort-arrows.component.scss'],
})
export class SortArrowsComponent {
  @Input() current: SortDirection;
  @Input() firstSort: SortDirection;
}
