import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { BarsHoverMoveEmitTooltipData } from 'src/app/viz-components/bars/bars-hover-move-effects';
import { BarsHoverMoveDirective } from 'src/app/viz-components/bars/bars-hover-move.directive';
import { BarsEventOutput } from 'src/app/viz-components/bars/bars-tooltip-data';
import { VicRoundUpToIntervalDomainPaddingConfig } from 'src/app/viz-components/data-marks/data-dimension.config';
import { EventEffect } from 'src/app/viz-components/events/effect';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.config';
import { JobDatum } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ArtHistoryUtilities } from '../../art-history.utilities';
import { EntityCategory } from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  ExploreSelections,
  ValueType,
} from '../explore-selections/explore-selections.model';
import {
  ChangeChartConfig,
  ChangeChartXAxisConfig,
  ChangeChartYAxisConfig,
} from './explore-change-chart.model';

interface ChangeChartTitle {
  valueTypePercent: string;
  valueTypeCount: string;
  fields: string;
  tenureAndRank: string;
  disaggregation: string;
  years: string;
}

interface ViewModel {
  dataMarksConfig: ChangeChartConfig;
  xAxisConfig: ChangeChartXAxisConfig;
  yAxisConfig: ChangeChartXAxisConfig;
  height: number;
  title: ChangeChartTitle;
  categoryLabel: string;
}
@Component({
  selector: 'app-explore-change-chart',
  templateUrl: './explore-change-chart.component.html',
  styleUrls: ['./explore-change-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExploreChangeChartComponent implements OnInit {
  @ViewChild('changeChart') changeChart: ElementRef<Element>;
  vm$: Observable<ViewModel>;
  xAxisConfig$: Observable<ChangeChartXAxisConfig>;
  width = 800;
  margin: ElementSpacing = {
    top: 24,
    right: 8,
    bottom: 36,
    left: 12,
  };
  barHeight = 36;
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput> =
    new BehaviorSubject<BarsEventOutput>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverEffects: EventEffect<BarsHoverMoveDirective>[] = [
    new BarsHoverMoveEmitTooltipData(),
  ];

  constructor(
    public exploreDataService: ExploreDataService,
    private fieldsService: ArtHistoryFieldsService,
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit(): void {
    this.vm$ = this.exploreDataService.changeData$.pipe(
      debounceTime(0),
      withLatestFrom(
        this.exploreDataService.selections$,
        this.exploreDataService.entityCategory$
      ),
      filter(([data, selections]) => !!data && !!selections),
      map(([data, selections, entityCategory]) => {
        const vm = {
          dataMarksConfig: this.getDataMarksConfig(
            data,
            entityCategory,
            selections
          ),
          xAxisConfig: this.getXAxisConfig(selections.valueType),
          yAxisConfig: this.getYAxisConfig(),
          height: this.setChartHeight(data),
          title: this.getTitle(entityCategory, selections),
          categoryLabel: ArtHistoryUtilities.getCategoryLabel(entityCategory),
        };
        return vm;
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  getDataMarksConfig(
    data: JobDatum[],
    entityCategory: EntityCategory,
    selections: ExploreSelections
  ): ChangeChartConfig {
    this.barHeight = data.length > 6 ? 24 : 36;
    const config = new ChangeChartConfig();
    config.data = data;
    config.ordinal.valueAccessor = (d) => d[entityCategory];
    config.quantitative.valueAccessor = (d) => d[selections.valueType];
    config.quantitative.valueFormat = this.getQuantitativeValueFormat(
      selections.valueType,
      selections.changeIsAverage
    );
    config.category.valueAccessor = (d) => d[entityCategory];
    config.category.colorScale = this.getColorScale(data, entityCategory);
    config.categoryLabelsAboveBars = true;
    config.barHeight = this.barHeight;
    config.quantitative.domainPadding =
      new VicRoundUpToIntervalDomainPaddingConfig();
    if (selections.valueType === ValueType.percent) {
      config.quantitative.domainPadding.interval = () => 0.2;
    } else {
      config.quantitative.domainPadding.interval = () => 5;
    }
    return config;
  }

  getColorScale(
    data: JobDatum[],
    entityCategory: EntityCategory
  ): (x: any) => any {
    if (entityCategory === 'field') {
      return (d) => this.fieldsService.getColorForField(d);
    } else {
      const color = this.fieldsService.getColorForField(data[0].field);
      return (d) => color;
    }
  }

  getQuantitativeDomain(valueType: keyof typeof ValueType): any {
    return valueType === 'percent' ? [0, 1] : undefined;
  }

  getQuantitativeValueFormat(
    valueType: keyof typeof ValueType,
    changeIsAverage: boolean
  ): string {
    let format;
    if (changeIsAverage && valueType === ValueType.count) {
      format = ',.1f';
    } else {
      format = artHistoryFormatSpecifications.explore.chart.value[valueType];
    }
    return format;
  }

  getQuantitativeTickFormat(valueType: keyof typeof ValueType): string {
    return artHistoryFormatSpecifications.explore.chart.tick[valueType];
  }

  setChartHeight(data: JobDatum[]): number {
    return (
      data.length * this.barHeight +
      this.margin.top +
      this.margin.bottom +
      (20 + 12) * data.length
    );
  }

  getXAxisConfig(valueType: keyof typeof ValueType): ChangeChartXAxisConfig {
    const config = new ChangeChartXAxisConfig();
    config.tickFormat = this.getQuantitativeTickFormat(valueType);
    return config;
  }

  getYAxisConfig(): ChangeChartYAxisConfig {
    const config = new ChangeChartYAxisConfig();
    config.wrap.wrapWidth = this.margin.left;
    return config;
  }

  getTitle(
    entityCategory: EntityCategory,
    selections: ExploreSelections
  ): ChangeChartTitle {
    const components = this.exploreDataService.getChartTitle(
      entityCategory,
      selections
    );
    const firstYear = selections.changeIsAverage
      ? 'Avg'
      : selections.years.start;

    return {
      valueTypePercent:
        selections.valueType === ValueType.percent ? ' (% pts)' : '',
      valueTypeCount:
        selections.valueType === ValueType.percent ? '' : 'count of',
      fields: components.fields,
      tenureAndRank: components.tenureAndRank,
      disaggregation: components.disaggregation,
      years: `${firstYear}\u2013${selections.years.end}`,
    };
  }

  updateTooltipForNewOutput(data: BarsEventOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput): void {
    const config = new VicHtmlTooltipConfig();
    config.panelClass = 'explore-change-tooltip';
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    if (data) {
      config.origin = data.elRef;
      config.size.minWidth = 200;
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.positionY - 2;
      config.show = true;
    } else {
      config.show = false;
      config.origin = undefined;
    }
    this.tooltipConfig.next(config);
  }
}
