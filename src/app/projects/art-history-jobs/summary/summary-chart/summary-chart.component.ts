import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  AxisConfig,
  DATA_MARKS,
  EventEffect,
  HtmlTooltipConfig,
  HtmlTooltipOffsetFromOriginPosition,
  STACKED_AREA,
  StackedAreaEventDatum,
  StackedAreaEventOutput,
  StackedAreaHoverMoveDirective,
  StackedAreaHoverMoveEmitTooltipData,
} from '@web-ast/viz-components';
import { BehaviorSubject } from 'rxjs';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
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
  @Input() xAxisConfig: AxisConfig;
  @Input() yAxisConfig: AxisConfig;
  width = 712;
  height = 652;
  margin: ElementSpacing = { top: 4, right: 56, bottom: 36, left: 24 };
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();
  tooltipData: BehaviorSubject<SummaryChartTooltipData> =
    new BehaviorSubject<SummaryChartTooltipData>(null);
  tooltipData$ = this.tooltipData.asObservable();
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
    const config = new HtmlTooltipConfig();
    config.panelClass = 'summary-chart-tooltip';
    config.position = new HtmlTooltipOffsetFromOriginPosition();
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
