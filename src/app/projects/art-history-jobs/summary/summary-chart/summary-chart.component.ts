import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { VicAxisConfig } from 'src/app/viz-components/axes/axis.config';
import { DATA_MARKS } from 'src/app/viz-components/data-marks/data-marks.token';
import { EventEffect } from 'src/app/viz-components/events/effect';
import { StackedAreaHoverMoveEmitTooltipData } from 'src/app/viz-components/stacked-area/stacked-area-hover-move-effects';
import { StackedAreaHoverMoveDirective } from 'src/app/viz-components/stacked-area/stacked-area-hover-move.directive';
import {
  StackedAreaEventDatum,
  StackedAreaEventOutput,
} from 'src/app/viz-components/stacked-area/stacked-area-tooltip-data';
import { STACKED_AREA } from 'src/app/viz-components/stacked-area/stacked-area.component';
import { VicStackedAreaModule } from 'src/app/viz-components/stacked-area/stacked-area.module';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.config';
import { VicHtmlTooltipModule } from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from 'src/app/viz-components/xy-background/xy-background.module';
import { VicXyChartModule } from 'src/app/viz-components/xy-chart/xy-chart.module';
import { VicXQuantitativeAxisModule } from '../../../../viz-components/axes/x-quantitative/x-quantitative-axis.module';
import { VicYQuantitativeAxisModule } from '../../../../viz-components/axes/y-quantitative-axis/y-quantitative-axis.module';
import { SummaryChartConfig } from './summary-chart.model';

class SummaryChartTooltipData implements StackedAreaEventOutput {
  total: number;
  data: StackedAreaEventDatum[];
  positionX: number;
  svgHeight?: number;

  constructor(data: StackedAreaEventOutput) {
    Object.assign(this, data);
  }
}

@Component({
  selector: 'app-summary-chart',
  standalone: true,
  imports: [
    CommonModule,
    VicHtmlTooltipModule,
    VicStackedAreaModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicXQuantitativeAxisModule,
    VicYQuantitativeAxisModule,
  ],
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.scss'],
  providers: [
    {
      provide: DATA_MARKS,
      useExisting: SummaryChartComponent,
    },
    {
      provide: STACKED_AREA,
      useExisting: SummaryChartComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryChartComponent {
  @Input() dataMarksConfig: SummaryChartConfig;
  @Input() xAxisConfig: VicAxisConfig;
  @Input() yAxisConfig: VicAxisConfig;
  width = 712;
  height = 652;
  margin: ElementSpacing = { top: 4, right: 0, bottom: 36, left: 24 };
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig
    .asObservable()
    .pipe(distinctUntilChanged((a, b) => isEqual(a, b)));
  tooltipData: BehaviorSubject<SummaryChartTooltipData> =
    new BehaviorSubject<SummaryChartTooltipData>(null);
  tooltipData$ = this.tooltipData
    .asObservable()
    .pipe(distinctUntilChanged((a, b) => isEqual(a, b)));
  hoverEffects: EventEffect<StackedAreaHoverMoveDirective>[] = [
    new StackedAreaHoverMoveEmitTooltipData(),
  ];
  chartBackgroundColor = grayLightest;

  updateTooltipForNewOutput(data: StackedAreaEventOutput): void {
    this.updateTooltipData(data);
    this.updateTooltipConfig(data);
  }

  updateTooltipData(data: StackedAreaEventOutput): void {
    const tooltipData = new SummaryChartTooltipData(data);
    tooltipData.total = data
      ? Math.round(tooltipData.data.reduce((acc, curr) => acc + +curr.y, 0))
      : null;
    this.tooltipData.next(tooltipData);
  }

  updateTooltipConfig(data: StackedAreaEventOutput): void {
    const config = new VicHtmlTooltipConfig();
    config.panelClass = 'summary-chart-tooltip';
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    config.position.tooltipOriginY = 'bottom';
    if (data) {
      config.size.minWidth = 200;
      config.size.height =
        data.svgHeight - this.margin.top - this.margin.bottom;
      config.position.offsetX = data.positionX;
      config.position.offsetY = data.svgHeight - this.margin.bottom;
      // config.position.offsetY = -this.margin.bottom;
      config.show = true;
    } else {
      config.show = false;
    }
    this.tooltipConfig.next(config);
  }
}
