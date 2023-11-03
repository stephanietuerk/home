import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { AxisConfig } from 'src/app/shared/charts/axes/axis.config';
import { DATA_MARKS } from 'src/app/shared/charts/data-marks/data-marks.token';
import { EventEffect } from 'src/app/shared/charts/events/effect';
import { HtmlTooltipConfig } from 'src/app/shared/charts/html-tooltip/html-tooltip.config';
import { EmitStackedAreaTooltipData } from 'src/app/shared/charts/stacked-area/stacked-area-effects';
import {
    StackedAreaEmittedOutput,
    StackedAreaHoverAndMoveEventDirective,
} from 'src/app/shared/charts/stacked-area/stacked-area-hover-move-event.directive';
import { STACKED_AREA } from 'src/app/shared/charts/stacked-area/stacked-area.component';
import { SummaryChartConfig } from './summary-chart.model';

class SummaryChartTooltipConfig extends HtmlTooltipConfig {
    constructor() {
        super();
        this.position.panelClass = 'summary-chart-tooltip';
        this.position.originY = 'bottom';
        this.size.minWidth = 200;
    }
}

class SummaryChartTooltipData extends StackedAreaEmittedOutput {
    total: number;
    constructor(data: StackedAreaEmittedOutput) {
        super();
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
    width: number = 712;
    height: number = 652;
    margin: ElementSpacing = { top: 4, right: 56, bottom: 36, left: 24 };
    tooltipConfig: BehaviorSubject<HtmlTooltipConfig> = new BehaviorSubject<HtmlTooltipConfig>(
        new HtmlTooltipConfig({ show: false })
    );
    tooltipConfig$ = this.tooltipConfig.asObservable();
    tooltipData: BehaviorSubject<SummaryChartTooltipData> = new BehaviorSubject<SummaryChartTooltipData>(null);
    tooltipData$ = this.tooltipData.asObservable();
    hoverEffects: EventEffect<StackedAreaHoverAndMoveEventDirective>[] = [new EmitStackedAreaTooltipData()];
    chartBackgroundColor = grayLightest;

    constructor() {}

    updateTooltipForNewOutput(data: StackedAreaEmittedOutput): void {
        this.updateTooltipData(data);
        this.updateTooltipConfig(data);
    }

    updateTooltipData(data: StackedAreaEmittedOutput): void {
        const tooltipData = new SummaryChartTooltipData(data);
        tooltipData.total = data ? Math.round(tooltipData.data.reduce((acc, curr) => acc + +curr.y, 0)) : null;
        this.tooltipData.next(tooltipData);
    }

    updateTooltipConfig(data: StackedAreaEmittedOutput): void {
        const config = new SummaryChartTooltipConfig();
        if (data) {
            config.size.height = data.svgHeight - this.margin.top - this.margin.bottom;
            config.position.offsetX = data.positionX + 1;
            config.position.offsetY = -this.margin.bottom;
            config.show = true;
        } else {
            config.show = false;
        }
        this.tooltipConfig.next(config);
    }
}
