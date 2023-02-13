import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '../../pipes/pipes.module';
import { XOrdinalAxisComponent } from './axes/x-ordinal/x-ordinal-axis.component';
import { XQuantitativeAxisComponent } from './axes/x-quantitative/x-quantitative-axis.component';
import { YOrdinalAxisComponent } from './axes/y-ordinal/y-ordinal-axis.component';
import { YQuantitativeAxisComponent } from './axes/y-quantitative/y-quantitative-axis.component';
import { BarsComponent } from './bars/bars.component';
import { ChartComponent } from './chart/chart.component';
import { HtmlTooltipComponent } from './html-tooltip/html-tooltip.component';
import { LinesComponent } from './lines/lines.component';
import { StackedAreaComponent } from './stacked-area/stacked-area.component';
import { XyBackgroundComponent } from './xy-background/xy-background.component';
import { XyChartSpaceComponent } from './xy-chart-space/xy-chart-space.component';

@NgModule({
    declarations: [
        ChartComponent,
        XyChartSpaceComponent,
        XyBackgroundComponent,
        XOrdinalAxisComponent,
        XQuantitativeAxisComponent,
        YOrdinalAxisComponent,
        YQuantitativeAxisComponent,
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
        XOrdinalAxisComponent,
        XQuantitativeAxisComponent,
        YOrdinalAxisComponent,
        YQuantitativeAxisComponent,
        BarsComponent,
        LinesComponent,
        HtmlTooltipComponent,
        StackedAreaComponent,
    ],
})
export class ChartsModule {}
