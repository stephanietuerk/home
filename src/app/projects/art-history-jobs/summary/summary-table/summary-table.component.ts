import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Sort, SortDirection } from 'src/app/core/enums/sort.enum';
import { TableHeader } from 'src/app/shared/components/table/table.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryTableComponent {
  @Output() newSort = new EventEmitter<void>();
  @Input() headers: TableHeader[];
  @Input() rows: any[];
  @Input() firstSort: SortDirection = Sort.desc;

  constructor(private fieldsService: ArtHistoryFieldsService) {}

  getHeaderClasses(header: TableHeader): string[] {
    const classes = [header.align];
    if (header.sort.canSort) {
      classes.push('sortable');
    }
    if (header.sort.direction) {
      classes.push('sorted');
    }
    return classes;
  }

  getTextColor(field: string): string {
    return this.fieldsService.getColorForField(field);
  }

  handleHeaderClick(header: TableHeader): void {
    if (header.sort.canSort) {
      this.setHeaderSortDirection(header.id);
      this.newSort.emit();
    }
  }

  setHeaderSortDirection(headerId: string): void {
    const secondSort = this.firstSort === Sort.asc ? Sort.desc : Sort.asc;
    this.headers.forEach((header) => {
      if (header.id === headerId) {
        if (!header.sort.direction) {
          header.sort.direction = this.firstSort;
        } else if (header.sort.direction === this.firstSort) {
          header.sort.direction = secondSort;
        } else {
          header.sort.direction = this.firstSort;
        }
      } else {
        header.sort.direction = null;
      }
    });
  }
}
