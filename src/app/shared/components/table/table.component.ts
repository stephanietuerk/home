import { Component, Input, OnInit } from '@angular/core';
import { Sort, SortDirection } from 'src/app/core/enums/sort.enum';
import { SortService } from 'src/app/core/services/sort.service';
import { TableHeader, TableSort } from './table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() headers: TableHeader[];
  @Input() rows: any[];
  @Input() firstSort: SortDirection = Sort.desc;

  constructor(public sortService: SortService) {}

  ngOnInit(): void {
    this.initSort();
  }

  initSort(): void {
    this.headers.forEach((header) => {
      if (
        header.sort.direction !== undefined &&
        header.sort.direction !== null
      ) {
        this.sortRows(header.sort, header.id);
      }
    });
  }

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

  handleHeaderClick(header: TableHeader): void {
    if (header.sort.canSort) {
      this.setHeaderSortDirection(header.id);
      this.sortRows(header.sort, header.id);
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

  sortRows(sort: TableSort, dataProperty: string): void {
    if (sort.direction) {
      this.rows.sort((a, b) =>
        this.sortService.valueCompare(
          sort.direction === Sort.asc,
          a[dataProperty],
          b[dataProperty]
        )
      );
    }
  }
}
