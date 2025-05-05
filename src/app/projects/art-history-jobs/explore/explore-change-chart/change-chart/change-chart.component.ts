import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHART } from 'src/app/viz-components/chart/chart.token';
import { XyChartComponent } from 'src/app/viz-components/xy-chart/xy-chart.component';

@Component({
    selector: 'app-change-chart',
    imports: [CommonModule],
    templateUrl: './change-chart.component.html',
    styleUrls: ['./change-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: CHART, useExisting: ChangeChartComponent }]
})
export class ChangeChartComponent extends XyChartComponent {}
