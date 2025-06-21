/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ChartConfig,
  HoverMoveAction,
  HtmlTooltipConfig,
  LinesConfig,
  LinesEventOutput,
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveDirective,
  LinesHoverMoveEmitTooltipData,
  VicChartConfigBuilder,
  VicChartModule,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
  VicLinesConfigBuilder,
  VicLinesModule,
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicXyBackgroundModule,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  withLatestFrom,
} from 'rxjs/operators';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { JobDatum } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ArtHistoryUtilities } from '../../art-history.utilities';
import { EntityCategory, ExploreChartTitle } from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  rankValueOptions,
  tenureValueOptions,
} from '../explore-selections/explore-selections.constants';
import { ValueType } from '../explore-selections/explore-selections.model';

interface ViewModel {
  chartConfig: ChartConfig;
  dataMarksConfig: LinesConfig<JobDatum>;
  xAxisConfig: VicXQuantitativeAxisConfig<Date>;
  yAxisConfig: VicYQuantitativeAxisConfig<number>;
  lineCategoryLabel: string;
  title: ExploreChartTitle;
  dataType: string;
}

@Component({
  selector: 'app-explore-across-time-chart',
  imports: [
    CommonModule,
    VicChartModule,
    VicLinesModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
  ],
  providers: [
    VicChartConfigBuilder,
    VicLinesConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
  templateUrl: './explore-across-time-chart.component.html',
  styleUrls: ['./explore-across-time-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExploreAcrossTimeChartComponent implements OnInit {
  vm$: Observable<ViewModel>;
  width = 800;
  height = 600;
  margin: ElementSpacing = {
    top: 4,
    right: 36,
    bottom: 36,
    left: 36,
  };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<LinesEventOutput<JobDatum>> =
    new BehaviorSubject(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: HoverMoveAction<LinesHoverMoveDirective<JobDatum>>[] = [
    new LinesHoverMoveDefaultStyles(),
    new LinesHoverMoveEmitTooltipData(),
  ];
  chartBackgroundColor = grayLightest;

  constructor(
    public exploreDataService: ExploreDataService,
    private fieldsService: ArtHistoryFieldsService,
    private chart: VicChartConfigBuilder,
    private lines: VicLinesConfigBuilder<JobDatum>,
    private xAxisQuantitative: VicXQuantitativeAxisConfigBuilder<Date>,
    private yAxisQuantitative: VicYQuantitativeAxisConfigBuilder<number>,
    private tooltip: VicHtmlTooltipConfigBuilder
  ) {}

  ngOnInit(): void {
    this.vm$ = this.exploreDataService.acrossTimeData$.pipe(
      debounceTime(0),
      withLatestFrom(
        this.exploreDataService.selections$,
        this.exploreDataService.entityCategory$
      ),
      filter(([data, selections]) => !!data && !!selections),
      map(([data, selections, entityCategory]) => {
        return {
          chartConfig: this.chart
            .margin(this.margin)
            .maxWidth(this.width)
            .maxHeight(this.height)
            .scalingStrategy('responsive-width')
            .getConfig(),
          dataMarksConfig: this.getDataMarksConfig(
            data,
            entityCategory,
            selections.valueType
          ),
          xAxisConfig: this.getXAxisConfig(),
          yAxisConfig: this.getYAxisConfig(selections.valueType),
          lineCategoryLabel:
            ArtHistoryUtilities.getCategoryLabel(entityCategory),
          title: this.exploreDataService.getChartTitle(
            entityCategory,
            selections
          ),
          dataType: selections.valueType,
        };
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  private getDataMarksConfig(
    data: JobDatum[],
    entityCategory: EntityCategory,
    valueType: keyof typeof ValueType
  ): LinesConfig<JobDatum> {
    return this.lines
      .data(data)
      .xDate((xDate) =>
        xDate
          .valueAccessor((d) => d.year)
          .formatSpecifier(
            artHistoryFormatSpecifications.summary.chart.value.year
          )
      )
      .y((y) =>
        y
          .valueAccessor((d) => d[valueType])
          .formatSpecifier(
            artHistoryFormatSpecifications.explore.chart.value[valueType]
          )
      )
      .stroke((stroke) =>
        stroke.color((color) =>
          color
            .valueAccessor((d) => {
              if (entityCategory === 'rank') {
                return d.rank[0];
              } else {
                return d[entityCategory];
              }
            })
            .scale((d) => {
              if (entityCategory === 'field') {
                return this.fieldsService.getColorForField(d);
              } else {
                return this.fieldsService.getColorForField(data[0].field);
              }
            })
        )
      )
      .labelLines(entityCategory !== 'field')
      .lineLabelsFormat((label) => this.getCategoryLabel(label, entityCategory))
      .pointMarkers((markers) => markers.display(true))
      .getConfig();
  }

  private getXAxisConfig(): VicXQuantitativeAxisConfig<Date> {
    return this.xAxisQuantitative
      .ticks((ticks) => ticks.count(5).format('%Y'))
      .getConfig();
  }

  private getYAxisConfig(
    valueType: keyof typeof ValueType
  ): VicYQuantitativeAxisConfig<number> {
    return this.yAxisQuantitative
      .ticks((ticks) =>
        ticks
          .format(artHistoryFormatSpecifications.explore.chart.tick[valueType])
          .count(5)
      )
      .baseline((baseline) => baseline.display(false))
      .getConfig();
  }

  getCategoryLabel(value: string, category: string): string {
    if (category === 'Field' || category === 'fields') {
      return value;
    } else if (category === 'Tenure status' || category === 'isTt') {
      return tenureValueOptions.find((x) => x.label === value).label;
    } else if (category === 'Rank' || category === 'rank') {
      return rankValueOptions.find((x) => x.label === value).label;
    } else {
      return value;
    }
  }

  updateTooltipForNewOutput(data: LinesEventOutput<JobDatum>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig();
  }

  updateTooltipData(data: LinesEventOutput<JobDatum>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(): void {
    const data = this.tooltipData.getValue();
    const config = this.tooltip
      .panelClass('explore-time-range-tooltip')
      .show(!!data)
      .linesPosition([
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - 4 : 0,
        },
      ])
      .size((size) => size.minWidth(200))
      .getConfig();
    this.tooltipConfig.next(config);
  }
}
