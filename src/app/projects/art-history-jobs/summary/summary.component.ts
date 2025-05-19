import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TableHeader,
  TableSort,
} from 'src/app/shared/components/table/table.model';
import { VicXyAxisModule } from '../../../viz-components-new/axes';
import { VicChartModule } from '../../../viz-components-new/charts';
import { VicStackedAreaModule } from '../../../viz-components-new/stacked-area';
import { VicHtmlTooltipModule } from '../../../viz-components-new/tooltips';
import { VicXyBackgroundModule } from '../../../viz-components-new/xy-background';
import { JobTableDatum } from '../art-history-data.model';
import { ArtHistorySummaryService } from './art-history-summary-sort.service';
import { SummaryChartComponent } from './summary-chart/summary-chart.component';
import { SummaryTableComponent } from './summary-table/summary-table.component';
import { tableHeaders } from './summary-table/summary-table.constants';

export interface ChartSort {
  function: SortFunction;
  categoryOrder: string[];
}

type SortFunction = (series: any) => number[];

@Component({
  selector: 'app-summary',
  imports: [
    CommonModule,
    SummaryChartComponent,
    SummaryTableComponent,
    VicChartModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  public tableData$: Observable<JobTableDatum[]>;
  tableHeaders: TableHeader[] = tableHeaders;

  constructor(protected summaryService: ArtHistorySummaryService) {}

  ngOnInit(): void {
    this.summaryService.initData();
    this.summaryService.initSort();
    this.summaryService.initTableData();
  }

  handleTableSort(activeSort: { id: string; sort: TableSort }): void {
    this.summaryService.setActiveSort(activeSort);
  }
}
