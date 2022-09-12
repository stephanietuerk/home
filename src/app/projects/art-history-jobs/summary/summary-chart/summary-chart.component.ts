import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { AxisConfig } from 'src/app/shared/components/charts/axes/axis-config.model';
import { LinesTooltipData } from 'src/app/shared/components/charts/lines/lines.model';
import { SummaryChartConfig } from './summary-chart.model';

@Component({
    selector: 'app-summary-chart',
    templateUrl: './summary-chart.component.html',
    styleUrls: ['./summary-chart.component.scss'],
})
export class SummaryChartComponent {
    @Input() dataMarksConfig: SummaryChartConfig;
    @Input() xAxisConfig: AxisConfig;
    @Input() yAxisConfig: AxisConfig;
    width: number = 712;
    height: number = 616;
    margin: ElementSpacing = { top: 4, right: 56, bottom: 36, left: 24 };
    tooltipData: BehaviorSubject<LinesTooltipData> = new BehaviorSubject<LinesTooltipData>(null);
    tooltipData$ = this.tooltipData.asObservable();

    constructor() {}

    updateChartOnNewTooltipData(param): void {}
}
