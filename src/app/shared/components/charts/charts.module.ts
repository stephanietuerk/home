import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '../../pipes/pipes.module';
import { BarsComponent } from './bars/bars.component';
import { ChartComponent } from './chart/chart.component';
import { HtmlTooltipComponent } from './html-tooltip/html-tooltip.component';
import { LinesComponent } from './lines/lines.component';
import { StackedAreaComponent } from './stacked-area/stacked-area.component';
import { XAxisComponent } from './x-axis/x-axis.component';
import { XyBackgroundComponent } from './xy-background/xy-background.component';
import { XyChartSpaceComponent } from './xy-chart-space/xy-chart-space.component';
import { YAxisComponent } from './y-axis/y-axis.component';

@NgModule({
    declarations: [
        ChartComponent,
        XyChartSpaceComponent,
        XyBackgroundComponent,
        XAxisComponent,
        YAxisComponent,
        BarsComponent,
        LinesComponent,
        HtmlTooltipComponent,
        StackedAreaComponent,
    ],
    imports: [CommonModule, PipesModule],
    exports: [
        ChartComponent,
        XyChartSpaceComponent,
        XyBackgroundComponent,
        XAxisComponent,
        YAxisComponent,
        BarsComponent,
        LinesComponent,
        HtmlTooltipComponent,
        StackedAreaComponent,
    ],
})
export class ChartsModule {}
