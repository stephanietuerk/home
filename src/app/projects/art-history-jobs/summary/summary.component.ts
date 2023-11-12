import { Component, OnInit } from '@angular/core';
import { AxisConfig } from '@web-ast/viz-components';
import { max } from 'd3';
import { cloneDeep } from 'lodash';
import { Observable, Subject, merge } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { Sort } from 'src/app/core/enums/sort.enum';
import { SortService } from 'src/app/core/services/sort.service';
import { TableHeader } from 'src/app/shared/components/table/table.model';
import { JobDatum, JobTableDatum } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { artHistoryFields } from '../art-history-fields.constants';
import { ArtHistoryFieldsService } from '../art-history-fields.service';
import {
  SummaryChartConfig,
  SummaryChartXAxisConfig,
  SummaryChartYAxisConfig,
} from './summary-chart/summary-chart.model';
import { tableHeaders } from './summary-table/summary-table.constants';

interface ViewModel {
  chartConfig: SummaryChartConfig;
  tableData: JobTableDatum[];
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}

interface ChartSort {
  function: SortFunction;
  categoryOrder: string[];
}

type SortFunction = (series: any) => number[];

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  public vm$: Observable<ViewModel>;
  sort = new Subject<void>();
  tableHeaders: TableHeader[] = tableHeaders;

  constructor(
    private dataService: ArtHistoryDataService,
    private fieldsService: ArtHistoryFieldsService,
    private sortService: SortService
  ) {}

  ngOnInit(): void {
    const vm$ = this.dataService.data$.pipe(
      map((data: JobDatum[]) => () => {
        const [tableData, chartSort]: [JobTableDatum[], ChartSort] =
          this.getTableDataAndChartSort(data);
        return {
          chartConfig: this.getChartConfig(data, chartSort),
          tableData,
          xAxisConfig: this.getXAxisConfig(data),
          yAxisConfig: this.getYAxisConfig(),
        };
      })
    );

    const sort$ = this.sort.pipe(
      map(() => (vm: ViewModel) => {
        const tableData = this.getSortedTableData(vm.tableData);
        const chartSort = this.getChartSort(tableData);
        return {
          ...vm,
          tableData,
          chartConfig: this.getUpdatedChartConfigForSort(
            vm.chartConfig,
            chartSort
          ),
        };
      })
    );

    this.vm$ = merge(vm$, sort$).pipe(
      scan((vm, mutationFn) => mutationFn(vm), {} as ViewModel)
    );
  }

  getTableDataAndChartSort(data): [JobTableDatum[], ChartSort] {
    const tableData = this.getTableData(data);
    this.sortTableData(tableData);
    const chartSort = this.getChartSort(tableData);
    return [tableData, chartSort];
  }

  getTableData(data: JobDatum[]): JobTableDatum[] {
    const currentYear = max(data.map((x) => x.year.getFullYear()));
    const filteredData = data.filter(
      (x) => x.isTt === 'All' && x.rank[0] === 'All'
    );
    const fields = artHistoryFields.map((x) => x.name.full);
    const tableData = fields.map((field) => {
      const fieldData = filteredData.filter((x) => x.field === field);
      const avg =
        fieldData.reduce((acc, cur) => acc + cur.count, 0) / fieldData.length;
      const currentValue = fieldData.find(
        (x) => x.year.getFullYear() === currentYear
      ).count;
      return {
        field,
        avg,
        current: currentValue,
      };
    });
    return tableData;
  }

  getXAxisConfig(data: JobDatum[]): AxisConfig {
    const config = new SummaryChartXAxisConfig();
    return config;
  }

  getYAxisConfig(): AxisConfig {
    return new SummaryChartYAxisConfig();
  }

  sortTableData(data: JobTableDatum[]): void {
    const sortHeader = this.tableHeaders.find((h) => h.sort.direction !== null);
    data.sort((a, b) =>
      this.sortService.valueCompare(
        sortHeader.sort.direction === Sort.asc,
        a[sortHeader.id],
        b[sortHeader.id]
      )
    );
  }

  getChartSort(data: JobTableDatum[]): ChartSort {
    const func = this.getStackSortFunction(data);
    const order = this.getKeyOrder(data);
    return {
      function: func,
      categoryOrder: order,
    };
  }

  getStackSortFunction(data: JobTableDatum[]): SortFunction {
    const orderedFields = this.getOrderedFields(data);
    return (series: any): number[] => {
      let n = series.length;
      const o = new Array(n);
      const fields = orderedFields;
      while (--n >= 0) {
        o[fields.indexOf(series[n].key)] = n;
      }
      return o;
    };
  }

  getOrderedFields(rows: JobTableDatum[]): string[] {
    return rows
      .map((x) => x.field)
      .filter((x) => x !== 'All')
      .reverse();
  }

  getKeyOrder(rows: JobTableDatum[]): string[] {
    return rows.map((x) => x.field).filter((x) => x !== 'All');
  }

  getChartConfig(data: JobDatum[], chartSort: ChartSort): SummaryChartConfig {
    const chartData = this.getChartData(data);
    const config = new SummaryChartConfig();
    config.data = chartData;
    config.category.colorScale = (d) => {
      return this.fieldsService.getColorForField(d);
    };
    config.stackOrderFunction = chartSort.function;
    config.categoryOrder = chartSort.categoryOrder;
    return config;
  }

  getChartData(data: JobDatum[]): JobDatum[] {
    const filteredData = cloneDeep(data).filter(
      (x) => x.isTt === 'All' && x.rank[0] === 'All' && x.field !== 'All'
    );
    return filteredData;
  }

  getSortedTableData(data: JobTableDatum[]): JobTableDatum[] {
    this.sortTableData(data);
    return data;
  }

  getUpdatedChartConfigForSort(
    config: SummaryChartConfig,
    chartSort: ChartSort
  ): SummaryChartConfig {
    return {
      ...config,
      stackOrderFunction: chartSort.function,
      categoryOrder: chartSort.categoryOrder,
    };
  }

  handleTableSort(): void {
    this.sort.next();
  }
}
