import { Injectable } from '@angular/core';
import { max } from 'd3';
import { cloneDeep } from 'lodash-es';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { Sort } from '../../../core/enums/sort.enum';
import { SortService } from '../../../core/services/sort.service';
import { TableHeader } from '../../../shared/components/table/table.model';
import { JobDatum, JobTableDatum } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { artHistoryFields } from '../art-history-fields.constants';
import { ActiveTableSort } from './summary-table/summary-table.component';
import { tableHeaders } from './summary-table/summary-table.constants';

@Injectable({
  providedIn: 'root',
})
export class ArtHistorySummaryService {
  jobsData$: Observable<JobDatum[]>;
  sortedTableData$: Observable<JobTableDatum[]>;
  private activeSort = new BehaviorSubject<ActiveTableSort>(null);
  activeSort$ = this.activeSort.asObservable();
  private orderedFields = new BehaviorSubject<string[]>(null);
  orderedFields$ = this.orderedFields.asObservable();
  tableHeaders: TableHeader[] = tableHeaders;

  constructor(
    private dataService: ArtHistoryDataService,
    private sortService: SortService
  ) {}

  initData(): void {
    if (!this.jobsData$) {
      this.jobsData$ = this.dataService.data$.pipe(
        filter((data): data is JobDatum[] => !!data)
      );
    }
  }

  initSort(): void {
    const activeSort = this.tableHeaders.find((h) => h.sort.direction !== null);
    if (activeSort) {
      this.setActiveSort({
        id: activeSort.id,
        sort: activeSort.sort,
      });
    }
  }

  initTableData(): void {
    this.sortedTableData$ = combineLatest([
      this.jobsData$,
      this.activeSort$,
    ]).pipe(
      map(([data, activeSort]) => {
        const tableData = this.getTableData(data);
        return this.getSortedTableData(tableData, activeSort);
      })
    );
  }

  getTableData(data: JobDatum[]): JobTableDatum[] {
    const currentYear = max(data.map((x) => x.year.getUTCFullYear()));
    const filteredData = data.filter(
      (x) => x.tenure === 'All' && x.rank[0] === 'All'
    );
    const fields = cloneDeep(artHistoryFields).map((x) => x.name.full);
    const tableData = fields.map((field) => {
      const fieldData = filteredData.filter((x) => x.field === field);
      const avg =
        fieldData.reduce((acc, cur) => acc + cur.count, 0) / fieldData.length;
      const currentValue = fieldData.find(
        (x) => x.year.getUTCFullYear() === currentYear
      ).count;
      return {
        field,
        avg,
        current: currentValue,
      };
    });
    return tableData;
  }

  getSortedTableData(
    data: JobTableDatum[],
    activeSort: ActiveTableSort
  ): JobTableDatum[] {
    const sorted = cloneDeep(data).sort((a, b) =>
      this.sortService.valueCompare(
        activeSort.sort.direction === Sort.asc,
        a[activeSort.id],
        b[activeSort.id]
      )
    );
    if (activeSort.id === 'field') {
      if (activeSort.sort.direction === Sort.asc) {
        const allIndex = sorted.findIndex((x) => x.field === 'All');
        const all = sorted.splice(allIndex, 1);
        sorted.unshift(all[0]);
      } else {
        const allIndex = sorted.findIndex((x) => x.field === 'All');
        const all = sorted.splice(allIndex, 1);
        sorted.push(all[0]);
      }
    }
    return sorted;
  }

  setActiveSort(activeSort: ActiveTableSort): void {
    this.activeSort.next(activeSort);
  }

  setOrderedFields(orderedFields: string[]): void {
    this.orderedFields.next(orderedFields);
  }
}
