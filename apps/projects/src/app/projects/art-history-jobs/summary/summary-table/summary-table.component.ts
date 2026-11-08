/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
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
import { SortArrowsComponent } from 'src/app/shared/components/sort-arrows/sort-arrows.component';
import {
  TableHeader,
  TableSort,
} from 'src/app/shared/components/table/table.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

export interface ActiveTableSort {
  id: string;
  sort: TableSort;
}

@Component({
  selector: 'app-summary-table',
  imports: [CommonModule, SortArrowsComponent],
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryTableComponent implements OnChanges {
  @Output() activeSort = new EventEmitter<ActiveTableSort>(null);
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
      this.setHeaderAriaLabel(header);
    });
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

  updateSort(header: TableHeader): void {
    if (header.sort.canSort) {
      this.setHeaderSortDirection(header.id);
      this.initHeaders();
      const activeSortHeader = this.headers.find((h) => h.id === header.id);
      this.activeSort.emit({
        id: activeSortHeader.id,
        sort: activeSortHeader.sort,
      });
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
