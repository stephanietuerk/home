import { Component, Input } from '@angular/core';
import { SortDirection } from 'src/app/core/enums/sort.enum';

@Component({
  selector: 'app-sort-arrows',
  templateUrl: './sort-arrows.component.html',
  styleUrls: ['./sort-arrows.component.scss'],
})
export class SortArrowsComponent {
  @Input() current: SortDirection;
  @Input() firstSort: SortDirection;
}
