import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { timeYear } from 'd3-time';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { DATA_MARKS } from 'src/app/viz-components/data-marks/data-marks.token';
import { EventEffect } from 'src/app/viz-components/events/effect';
import {
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveEmitTooltipData,
} from 'src/app/viz-components/lines/lines-hover-move-effects';
import { LinesHoverMoveDirective } from 'src/app/viz-components/lines/lines-hover-move.directive';
import { LinesEventOutput } from 'src/app/viz-components/lines/lines-tooltip-data';
import { LINES } from 'src/app/viz-components/lines/lines.component';
import {
  HtmlTooltipConfig,
  HtmlTooltipOffsetFromOriginPosition,
} from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.config';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import {
  ExploreTimeRangeChartData,
  LineCategoryType,
} from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  rankOptions,
  tenureOptions,
} from '../explore-selections/explore-selections.constants';
import { ExploreSelections } from '../explore-selections/explore-selections.model';
import {
  ExploreTimeRangeChartConfig,
  ExploreTimeRangeXAxisConfig,
  ExploreTimeRangeYAxisConfig,
} from './explore-time-range-chart.model';

interface ViewModel {
  dataMarksConfig: ExploreTimeRangeChartConfig;
  xAxisConfig: ExploreTimeRangeXAxisConfig;
  yAxisConfig: ExploreTimeRangeYAxisConfig;
  lineCategoryLabel: string;
  title: string;
  dataType: string;
}

@Component({
  selector: 'app-explore-time-range-chart',
  templateUrl: './explore-time-range-chart.component.html',
  styleUrls: ['./explore-time-range-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: LINES, useExisting: ExploreTimeRangeChartComponent },
    { provide: DATA_MARKS, useExisting: ExploreTimeRangeChartComponent },
  ],
})
export class ExploreTimeRangeChartComponent implements OnInit {
  vm$: Observable<ViewModel>;
  width = 800;
  height = 500;
  margin: ElementSpacing = {
    top: 4,
    right: 36,
    bottom: 36,
    left: 36,
  };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEventOutput> =
    new BehaviorSubject<LinesEventOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverEffects: EventEffect<LinesHoverMoveDirective>[] = [
    new LinesHoverMoveDefaultStyles(),
    new LinesHoverMoveEmitTooltipData(),
  ];
  chartBackgroundColor = grayLightest;

  constructor(
    public exploreDataService: ExploreDataService,
    private fieldsService: ArtHistoryFieldsService
  ) {}

  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.exploreDataService.chartsData$,
      this.exploreDataService.selections$,
    ]).pipe(
      filter(([chartData]) => !!chartData?.timeRange),
      map(([chartData, selections]) => {
        return {
          dataMarksConfig: this.getDataMarksConfig(chartData.timeRange),
          xAxisConfig: this.getXAxisConfig(),
          yAxisConfig: this.getYAxisConfig(chartData.timeRange),
          lineCategoryLabel: this.getLineCategoryLabel(
            chartData.timeRange.categories
          ),
          title: selections
            ? this.getTitle(chartData.timeRange.categories, selections)
            : '',
          dataType: selections ? selections.dataType : '',
        };
      })
    );
  }

  private getDataMarksConfig(
    chartData: ExploreTimeRangeChartData
  ): ExploreTimeRangeChartConfig {
    const config = new ExploreTimeRangeChartConfig();
    config.data = chartData.data;
    config.y.valueAccessor = (d: any) => d[chartData.dataType];
    config.y.valueFormat =
      artHistoryFormatSpecifications.explore.chart.value[chartData.dataType];
    config.category.valueAccessor = (d: any) => d[chartData.categories];
    config.category.colorScale = this.getColorScale(chartData);
    if (chartData.categories !== 'field') {
      config.labelLines = true;
      // config.labels.display = true;
      // config.labels.align = 'inside';
      config.lineLabelsFormat = (d: any) =>
        this.getCategoryLabel(d, chartData.categories);
    }
    return config;
  }

  getColorScale(chartData: ExploreTimeRangeChartData): (x: any) => any {
    if (chartData.categories === 'field') {
      return (d) => this.fieldsService.getColorForField(d);
    } else {
      const color = this.fieldsService.getColorForField(
        chartData.data[0].field
      );
      return (d) => color;
    }
  }

  private getXAxisConfig(): ExploreTimeRangeXAxisConfig {
    const config = new ExploreTimeRangeXAxisConfig();
    config.numTicks = timeYear;
    return config;
  }

  private getYAxisConfig(
    chartData: ExploreTimeRangeChartData
  ): ExploreTimeRangeYAxisConfig {
    const config = new ExploreTimeRangeYAxisConfig();
    config.tickFormat =
      artHistoryFormatSpecifications.explore.chart.tick[chartData.dataType];
    return config;
  }

  private getLineCategoryLabel(lineType: LineCategoryType): string {
    if (lineType === 'field') {
      return 'Field';
    } else if (lineType === 'isTt') {
      return 'Tenure status';
    } else if (lineType === 'rank') {
      return 'Rank';
    } else {
      return '';
    }
  }

  updateTooltipForNewOutput(data: LinesEventOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: LinesEventOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: LinesEventOutput): void {
    const config = new HtmlTooltipConfig();
    config.panelClass = 'explore-time-range-tooltip';
    config.position = new HtmlTooltipOffsetFromOriginPosition();
    if (data) {
      config.size.minWidth = 200;
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 16;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }

  updateChartOnNewTooltipData(data: LinesEventOutput): void {
    if (data) {
      const { x, ...rest } = data;
      const transformedData: LinesEventOutput = {
        ...rest,
        x: x.split(' ')[3],
      };
      this.updateTooltipData(transformedData);
    }
  }

  getCategoryLabel(value: string, category: string): string {
    if (category === 'Field' || category === 'fields') {
      return value;
    } else if (category === 'Tenure status' || category === 'isTt') {
      return tenureOptions.find((x) => x.label === value).label;
    } else if (category === 'Rank' || category === 'rank') {
      return rankOptions.find((x) => x.label === value).label;
    } else {
      return value;
    }
  }

  getTitle(
    categories: LineCategoryType,
    selections: ExploreSelections
  ): string {
    let fields;
    let disaggregation;
    if (categories === 'field') {
      disaggregation = 'by field';
      if (selections.dataType === 'count') {
        fields = '';
      } else {
        fields = 'all';
      }
    } else {
      fields = selections.fields.join('');
      if (categories === 'isTt') {
        disaggregation = 'by tenure status';
      } else {
        disaggregation = 'by rank';
      }
    }
    return `${
      selections.dataType
    } of ${fields.toLowerCase()} jobs ${disaggregation}`;
  }
}
