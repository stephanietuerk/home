import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ChartConfig,
  ElementSpacing,
  HoverMoveAction,
  HtmlTooltipConfig,
  StackedAreaConfig,
  StackedAreaEventOutput,
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicStackedAreaConfigBuilder,
  VicStackedAreaModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { JobDatum, JobTableDatum } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ArtHistorySummaryService } from '../art-history-summary-sort.service';
import { ChartSort } from '../summary.component';
import { GetTotalFromDataPipe } from './get-total-from-data.pipe';

interface ViewModel {
  chartConfig: ChartConfig;
  dataConfig: StackedAreaConfig<JobDatum, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-summary-chart',
  imports: [
    CommonModule,
    VicChartModule,
    VicStackedAreaModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
    GetTotalFromDataPipe,
  ],
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.scss'],
  providers: [
    VicChartConfigBuilder,
    VicStackedAreaConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryChartComponent implements OnInit {
  vm$: Observable<ViewModel>;
  width = 700;
  height = 680;
  margin: ElementSpacing = { top: 8, right: 0, bottom: 36, left: 24 };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig
    .asObservable()
    .pipe(distinctUntilChanged((a, b) => isEqual(a, b)));
  tooltipData: BehaviorSubject<StackedAreaEventOutput<JobDatum, string>> =
    new BehaviorSubject<StackedAreaEventOutput<JobDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverAndMoveActions: HoverMoveAction<
    StackedAreaHoverMoveDirective<JobDatum, string>
  >[] = [new StackedAreaHoverMoveEmitTooltipData()];
  chartBackgroundColor = grayLightest;

  constructor(
    private summaryService: ArtHistorySummaryService,
    private chart: VicChartConfigBuilder,
    private stackedArea: VicStackedAreaConfigBuilder<JobDatum, string>,
    private xAxisQuantitative: VicXQuantitativeAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder,
    private fieldsService: ArtHistoryFieldsService
  ) {}

  ngOnInit(): void {
    this.setViewModel();
  }

  setViewModel(): void {
    this.vm$ = combineLatest([
      this.summaryService.jobsData$,
      this.summaryService.sortedTableData$,
    ]).pipe(
      map(([data, sortedTableData]) => {
        const chartData = this.getChartData(data);
        const chartSort = this.getChartSort(sortedTableData);
        return this.getViewModel(chartData, chartSort);
      })
    );
  }

  getChartData(data: JobDatum[]): JobDatum[] {
    const filteredData = data.filter(
      (x) => x.tenure === 'All' && x.rank[0] === 'All' && x.field !== 'All'
    );
    return filteredData;
  }

  getChartSort(tableData: JobTableDatum[]): ChartSort {
    const func = this.getStackSortFunction(tableData);
    const order = this.getKeyOrder(tableData);
    return {
      function: func,
      categoryOrder: order,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStackSortFunction(data: JobTableDatum[]): (series: any) => number[] {
    const orderedFields = this.getOrderedFields(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  getViewModel(data: JobDatum[], chartSort: ChartSort): ViewModel {
    const chartConfig = this.chart
      .margin(this.margin)
      .maxWidth(this.width)
      .maxHeight(this.height)
      .scalingStrategy('responsive-width')
      .getConfig();

    const xAxisConfig = this.xAxisQuantitative
      .ticks((ticks) =>
        ticks.format(artHistoryFormatSpecifications.summary.chart.tick.year)
      )
      .getConfig();

    const yAxisConfig = this.yAxisQuantitative
      .ticks((ticks) =>
        ticks
          .format(artHistoryFormatSpecifications.summary.chart.tick.count)
          .count(5)
      )
      .baseline((baseline) => baseline.display(false))
      .getConfig();

    const dataConfig = this.stackedArea
      .data(data)
      .xDate((dimension) =>
        dimension
          .valueAccessor((d) => d.year)
          .formatSpecifier(
            artHistoryFormatSpecifications.summary.chart.value.year
          )
      )
      .y((dimension) =>
        dimension
          .valueAccessor((d) => d.count)
          .formatSpecifier(
            artHistoryFormatSpecifications.summary.chart.value.count
          )
      )
      .color((dimension) =>
        dimension
          .valueAccessor((d) => d.field)
          .scale((d) => this.fieldsService.getColorForField(d))
      )
      .stackOrder(chartSort.function)
      .categoricalOrder(chartSort.categoryOrder)
      .getConfig();

    return {
      chartConfig,
      dataConfig,
      xAxisConfig,
      yAxisConfig,
    };
  }

  updateTooltipForNewOutput(
    data: StackedAreaEventOutput<JobDatum, string>
  ): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: StackedAreaEventOutput<JobDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: StackedAreaEventOutput<JobDatum, string>): void {
    const config = this.tooltip
      .panelClass('summary-chart-tooltip')
      .size((size) => size.minWidth(130))
      .offsetFromOriginPosition((position) => {
        if (!data) {
          return null;
        }
        return position
          .offsetX(data.positionX - 340 / 2)
          .offsetY(this.margin.top);
      })
      .show(!!data)
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
