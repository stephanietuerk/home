import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { timeYear } from 'd3-time';
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
import { EventEffect } from 'src/app/viz-components/events/effect';
import {
  LinesHoverMoveDefaultStyles,
  LinesHoverMoveEmitTooltipData,
} from 'src/app/viz-components/lines/lines-hover-move-effects';
import { LinesHoverMoveDirective } from 'src/app/viz-components/lines/lines-hover-move.directive';
import { LinesEventOutput } from 'src/app/viz-components/lines/lines-tooltip-data';
import {
  HtmlTooltipConfig,
  HtmlTooltipOffsetFromOriginPosition,
} from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.config';
import { JobDatum, JobProperty } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ArtHistoryUtilities } from '../../art-history.utilities';
import { EntityCategory } from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  rankValueOptions,
  tenureValueOptions,
} from '../explore-selections/explore-selections.constants';
import {
  ExploreSelections,
  FilterType,
  ValueType,
} from '../explore-selections/explore-selections.model';
import {
  ExploreTimeRangeChartConfig,
  ExploreTimeRangeXAxisConfig,
  ExploreTimeRangeYAxisConfig,
} from './explore-across-time-chart.model';

interface ViewModel {
  dataMarksConfig: ExploreTimeRangeChartConfig;
  xAxisConfig: ExploreTimeRangeXAxisConfig;
  yAxisConfig: ExploreTimeRangeYAxisConfig;
  lineCategoryLabel: string;
  title: string;
  dataType: string;
}

@Component({
  selector: 'app-explore-across-time-chart',
  templateUrl: './explore-across-time-chart.component.html',
  styleUrls: ['./explore-across-time-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExploreAcrossTimeChartComponent implements OnInit {
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
    this.vm$ = this.exploreDataService.acrossTimeData$.pipe(
      debounceTime(0),
      withLatestFrom(
        this.exploreDataService.selections$,
        this.exploreDataService.entityCategory$
      ),
      filter(([data, selections]) => !!data && !!selections),
      map(([data, selections, entityCategory]) => {
        return {
          dataMarksConfig: this.getDataMarksConfig(
            data,
            entityCategory,
            selections.valueType
          ),
          xAxisConfig: this.getXAxisConfig(),
          yAxisConfig: this.getYAxisConfig(selections.valueType),
          lineCategoryLabel:
            ArtHistoryUtilities.getCategoryLabel(entityCategory),
          title: this.getTitle(entityCategory, selections),
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
  ): ExploreTimeRangeChartConfig {
    const config = new ExploreTimeRangeChartConfig();
    config.data = data;
    config.y.valueAccessor = (d: any) => d[valueType];
    config.y.valueFormat =
      artHistoryFormatSpecifications.explore.chart.value[valueType];
    config.category.valueAccessor = (d: any) => d[entityCategory];
    config.category.colorScale = this.getColorScale(entityCategory, data);
    config.labels.display = entityCategory !== 'field';
    if (entityCategory !== 'field') {
      config.labels.format = (d: any) =>
        this.getCategoryLabel(d, entityCategory);
    }
    return config;
  }

  getColorScale(
    entityCategory: EntityCategory,
    data: JobDatum[]
  ): (x: any) => any {
    if (entityCategory === 'field') {
      return (d) => this.fieldsService.getColorForField(d);
    } else {
      const color = this.fieldsService.getColorForField(data[0].field);
      return (d) => color;
    }
  }

  private getXAxisConfig(): ExploreTimeRangeXAxisConfig {
    const config = new ExploreTimeRangeXAxisConfig();
    config.numTicks = timeYear;
    return config;
  }

  private getYAxisConfig(
    valueType: keyof typeof ValueType
  ): ExploreTimeRangeYAxisConfig {
    const config = new ExploreTimeRangeYAxisConfig();
    config.tickFormat =
      artHistoryFormatSpecifications.explore.chart.tick[valueType];
    return config;
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
      config.position.offsetY = data.positionY - 2;
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
      return tenureValueOptions.find((x) => x.label === value).label;
    } else if (category === 'Rank' || category === 'rank') {
      return rankValueOptions.find((x) => x.label === value).label;
    } else {
      return value;
    }
  }

  getTitle(categories: EntityCategory, selections: ExploreSelections): string {
    let fields = '';
    let disaggregation;
    let tenureSelection;
    let rankSelection;
    let tenureAndRankString = '';
    if (categories === JobProperty.field) {
      if (selections.fieldUse === FilterType.disaggregate) {
        disaggregation = 'by field';
        if (selections.valueType === ValueType.percent) {
          fields = 'all';
        }
      }
      if (
        selections.tenureUse === FilterType.filter &&
        selections.tenureValues[0] !== tenureValueOptions[0].label
      ) {
        tenureSelection = selections.tenureValues[0];
      }
      if (
        selections.rankUse === FilterType.filter &&
        selections.rankValues[0] !== rankValueOptions[0].label
      ) {
        rankSelection = selections.rankValues[0];
      }
      tenureAndRankString = `${tenureSelection ?? ''}${
        tenureSelection && rankSelection ? ',' : ''
      } ${rankSelection ?? ''}`;
    } else {
      fields = selections.fieldValues.join('');
      if (categories === JobProperty.tenure) {
        disaggregation = 'by tenure status';
      } else {
        disaggregation = 'by rank';
      }
    }
    return `${
      selections.valueType
    } of ${fields.toLowerCase()}${tenureAndRankString} jobs ${disaggregation}`;
  }
}
