import { Directive } from '@angular/core';
import { AxisConfig } from 'src/app/shared/components/charts/xy-chart-space/axis-config.model';
import { ExploreChart } from '../explore-chart/explore-chart.class';

@Directive()
export abstract class ExploreXYChart extends ExploreChart {
    xAxisConfig: AxisConfig;
    yAxisConfig: AxisConfig;

    override setChartProperties(): void {
        this.dataMarksConfig = this.getNewDataMarksConfig();
        this.xAxisConfig = this.getNewXAxisConfig();
        this.yAxisConfig = this.getNewYAxisConfig();
    }

    abstract getNewXAxisConfig(): any;
    abstract getNewYAxisConfig(): any;
}
