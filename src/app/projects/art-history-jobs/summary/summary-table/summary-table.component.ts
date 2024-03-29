import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Sort, SortDirection } from 'src/app/core/enums/sort.enum';
import {
  TableHeader,
  TableSort,
} from 'src/app/shared/components/table/table.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryTableComponent implements OnChanges {
  @Output() newSort = new EventEmitter<void>();
  @Input() headers: TableHeader[];
  @Input() rows: any[];

  constructor(private fieldsService: ArtHistoryFieldsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['headers']) {
      this.initHeaders();
    }
  }

  initHeaders(): void {
    this.headers.forEach((header) => {
      this.setHeaderClasses(header);
      this.setHeaderAriaLabel(header);
    });
  }

  setHeaderClasses(header: TableHeader): void {
    header.classes = [header.align];
    if (header.sort.canSort) {
      header.classes.push('sortable');
    }
    if (header.sort.direction) {
      header.classes.push('sorted');
    }
  }

  setHeaderAriaLabel(header: TableHeader): void {
    if (header.sort.canSort) {
      const sortLabel = this.getFullSortLabel(header.sort.direction);
      header.ariaLabeL = `${header.display}${
        header.sort.direction ? ', sorted by ' + sortLabel + ' values' : ''
      }. Click to sort by ${this.getFullSortLabel(
        this.getNextSortDirection(header.sort)
      )} values.`;
    }
  }

  getNextSortDirection(sort: TableSort): SortDirection {
    if (!sort.direction) {
      return sort.firstSort;
    } else if (sort.direction === Sort.asc) {
      return Sort.desc;
    } else {
      return Sort.asc;
    }
  }

  getTextColor(field: string): string {
    return this.fieldsService.getColorForField(field);
  }

  handleHeaderClick(header: TableHeader): void {
    if (header.sort.canSort) {
      this.setHeaderSortDirection(header.id);
      this.initHeaders();
      this.newSort.emit();
    }
  }

  setHeaderSortDirection(headerId: string): void {
    this.headers.forEach((header) => {
      if (header.id === headerId) {
        if (!header.sort.direction) {
          header.sort.direction = header.sort.firstSort;
        } else if (header.sort.direction === header.sort.firstSort) {
          header.sort.direction = this.getSecondSortDirection(
            header.sort.firstSort
          );
        } else {
          header.sort.direction = header.sort.firstSort;
        }
      } else {
        header.sort.direction = null;
      }
    });
  }

  getSecondSortDirection(firstSort: SortDirection): SortDirection {
    return firstSort === Sort.asc ? Sort.desc : Sort.asc;
  }

  getFullSortLabel(sort: SortDirection): string {
    return sort === Sort.asc ? 'ascending' : 'descending';
  }
}
