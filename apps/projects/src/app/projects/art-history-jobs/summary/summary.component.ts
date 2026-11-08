import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TableHeader,
  TableSort,
} from 'src/app/shared/components/table/table.model';
import { VicXyAxisModule } from '../../../shared/components/viz/axes';
import { VicChartModule } from '../../../shared/components/viz/charts/chart.module';
import { VicStackedAreaModule } from '../../../shared/components/viz/stacked-area/stacked-area.module';
import { VicHtmlTooltipModule } from '../../../shared/components/viz/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from '../../../shared/components/viz/xy-background/xy-background.module';
import { JobTableDatum } from '../art-history-data.model';
import { ArtHistorySummaryService } from './art-history-summary-sort.service';
import { SummaryChartComponent } from './summary-chart/summary-chart.component';
import { SummaryTableComponent } from './summary-table/summary-table.component';
import { tableHeaders } from './summary-table/summary-table.constants';

export interface ChartSort {
  function: SortFunction;
  categoryOrder: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
