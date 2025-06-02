import { CommonModule } from '@angular/common';
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
import {
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '../../../../viz-components-new/axes';
import {
  BarsConfig,
  BarsEventOutput,
  BarsHoverMoveDirective,
  BarsHoverMoveEmitTooltipData,
  VicBarsConfigBuilder,
  VicBarsModule,
} from '../../../../viz-components-new/bars';
import {
  ChartConfig,
  VicChartConfigBuilder,
  VicChartModule,
} from '../../../../viz-components-new/charts';
import { ElementSpacing } from '../../../../viz-components-new/core';
import { HoverMoveAction } from '../../../../viz-components-new/events/action';
import {
  HtmlTooltipConfig,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
} from '../../../../viz-components-new/tooltips';
import { VicXyBackgroundModule } from '../../../../viz-components-new/xy-background';
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
import { ChangeBarsComponent } from './change-bars/change-bars.component';
import { ChangeChartToggleComponent } from './change-chart-toggle/change-chart-toggle.component';
import { ChangeChartComponent } from './change-chart/change-chart.component';

interface ChangeChartTitle {
  valueTypePercent: string;
  valueTypeCount: string;
  fields: string;
  tenureAndRank: string;
  disaggregation: string;
  years: string;
}

interface ViewModel {
  chartConfig: ChartConfig;
  dataMarksConfig: BarsConfig<JobDatum, string>;
  xAxisConfig: VicXQuantitativeAxisConfig<number>;
  title: ChangeChartTitle;
  categoryLabel: string;
  barHeight: number;
}
@Component({
  selector: 'app-explore-change-chart',
  imports: [
    CommonModule,
    VicChartModule,
    VicBarsModule,
    VicXyBackgroundModule,
    VicXyAxisModule,
    VicHtmlTooltipModule,
    ChangeChartComponent,
    ChangeBarsComponent,
    ChangeChartToggleComponent,
  ],
  providers: [
    VicChartConfigBuilder,
    VicBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicHtmlTooltipConfigBuilder,
  ],
  templateUrl: './explore-change-chart.component.html',
  styleUrls: ['./explore-change-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExploreChangeChartComponent implements OnInit {
  @ViewChild('changeChart') changeChart: ElementRef<Element>;
  vm$: Observable<ViewModel>;
  width = 800;
  margin: ElementSpacing = {
    top: 24,
    right: 8,
    bottom: 36,
    left: 12,
  };
  barHeight = 36;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<BarsEventOutput<JobDatum, string>> =
    new BehaviorSubject<BarsEventOutput<JobDatum, string>>(null);
  tooltipData$ = this.tooltipData.asObservable();
  hoverActions: HoverMoveAction<BarsHoverMoveDirective<JobDatum, string>>[] = [
    new BarsHoverMoveEmitTooltipData(),
  ];

  constructor(
    public exploreDataService: ExploreDataService,
    private fieldsService: ArtHistoryFieldsService,
    private bars: VicBarsConfigBuilder<JobDatum, string>,
    private chart: VicChartConfigBuilder,
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yOrdinalAxis: VicYOrdinalAxisConfigBuilder<string>,
    private tooltip: VicHtmlTooltipConfigBuilder
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
        const height = this.getChartHeight(data);
        const vm = {
          chartConfig: this.chart
            .margin(this.margin)
            .width(this.width)
            .height(height)
            .resize({ width: true, height: true })
            .getConfig(),
          dataMarksConfig: this.getDataMarksConfig(
            data,
            entityCategory,
            selections
          ),
          xAxisConfig: this.getXAxisConfig(selections.valueType),
          title: this.getTitle(entityCategory, selections),
          categoryLabel: ArtHistoryUtilities.getCategoryLabel(entityCategory),
          barHeight: data.length > 6 ? 24 : 36,
        };
        return vm;
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  getDataMarksConfig(
    data: JobDatum[],
    entityCategory: 'field' | 'rank' | 'tenure',
    selections: ExploreSelections
  ): BarsConfig<JobDatum, string> {
    return this.bars
      .data(data)
      .horizontal((bars) =>
        bars
          .x((x) =>
            x
              .valueAccessor((d) => d[selections.valueType])
              .formatSpecifier(
                this.getQuantitativeValueFormat(
                  selections.valueType,
                  selections.changeIsAverage
                )
              )
              .domainPaddingRoundUpToInterval(() =>
                selections.valueType === ValueType.percent ? 0.2 : 5
              )
          )
          .y((y) =>
            y
              .valueAccessor((d) => d[entityCategory] as string)
              .paddingInner(0.15)
          )
      )
      .color((color) =>
        color
          .valueAccessor((d) => d[entityCategory] as string)
          .scale((category) => {
            if (entityCategory === 'field') {
              return this.fieldsService.getColorForField(category);
            } else {
              return this.fieldsService.getColorForField(data[0].field);
            }
          })
      )
      .backgrounds((backgrounds) => backgrounds.events(true))
      .labels((labels) => labels.display(true))
      .getConfig();
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

  getChartHeight(data: JobDatum[]): number {
    return (
      data.length * this.barHeight +
      this.margin.top +
      this.margin.bottom +
      (20 + 12) * data.length
    );
  }

  getXAxisConfig(
    valueType: keyof typeof ValueType
  ): VicXQuantitativeAxisConfig<number> {
    const config = this.xQuantitativeAxis
      .side('top')
      .ticks((ticks) =>
        ticks.format(this.getQuantitativeTickFormat(valueType)).count(5)
      )
      .getConfig();
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

  updateTooltipForNewOutput(data: BarsEventOutput<JobDatum, string>): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: BarsEventOutput<JobDatum, string>): void {
    this.tooltipData.next(data);
  }

  updateTooltipConfig(data: BarsEventOutput<JobDatum, string>): void {
    const config = this.tooltip
      .barsPosition(data?.origin, [
        {
          offsetX: data?.positionX,
          offsetY: data ? data.positionY - 12 : undefined,
        },
      ])
      .panelClass('explore-change-tooltip')
      .show(!!data)
      .size((size) => size.minWidth(200))
      .getConfig();

    this.tooltipConfig.next(config);
  }
}
