import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '../pipes/pipes.module';
import { XOrdinalAxisComponent } from './axes/x-ordinal/x-ordinal-axis.component';
import { XQuantitativeAxisComponent } from './axes/x-quantitative/x-quantitative-axis.component';
import { YOrdinalAxisComponent } from './axes/y-ordinal/y-ordinal-axis.component';
import { YQuantitativeAxisComponent } from './axes/y-quantitative/y-quantitative-axis.component';
import { BarsComponent } from './bars/bars.component';
import { ChartComponent } from './chart/chart.component';
import { GeographiesHoverAndMoveEventDirective } from './geographies/geographies-hover-move-event.directive';
import { GeographiesComponent } from './geographies/geographies.component';
import { HtmlTooltipDirective } from './html-tooltip/html-tooltip.directive';
import { LinesHoverEventDirective } from './lines/lines-hover-event.directive';
import { LinesHoverAndMoveEventDirective } from './lines/lines-hover-move-event.directive';
import { LinesInputEventDirective } from './lines/lines-input-event.directive';
import { LinesComponent } from './lines/lines.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { ContinuousLegendComponent } from './map-legend/continuous-legend/continuous-legend.component';
import { DiscontinuousLegendComponent } from './map-legend/discontinuous-legend/discontinuous-legend.component';
import { MapLegendComponent } from './map-legend/map-legend.component';
import { StackedAreaComponent } from './stacked-area/stacked-area.component';
import { XYBackgroundComponent } from './xy-background/xy-background.component';
import { XyChartComponent } from './xy-chart/xy-chart.component';

@NgModule({
    declarations: [
        ChartComponent,
        XYBackgroundComponent,
        BarsComponent,
        LinesComponent,
        GeographiesComponent,
        HtmlTooltipDirective,
        XOrdinalAxisComponent,
        XQuantitativeAxisComponent,
        YOrdinalAxisComponent,
        YQuantitativeAxisComponent,
        XyChartComponent,
        MapChartComponent,
        MapLegendComponent,
        ContinuousLegendComponent,
        DiscontinuousLegendComponent,
        LinesHoverAndMoveEventDirective,
        LinesInputEventDirective,
        LinesHoverEventDirective,
        GeographiesHoverAndMoveEventDirective,
        StackedAreaComponent,
    ],
    imports: [CommonModule, PipesModule],
    exports: [
        ChartComponent,
        XYBackgroundComponent,
        BarsComponent,
        LinesComponent,
        GeographiesComponent,
        HtmlTooltipDirective,
        XOrdinalAxisComponent,
        XQuantitativeAxisComponent,
        YOrdinalAxisComponent,
        YQuantitativeAxisComponent,
        XyChartComponent,
        MapChartComponent,
        MapLegendComponent,
        LinesHoverAndMoveEventDirective,
        LinesInputEventDirective,
        LinesHoverEventDirective,
        GeographiesHoverAndMoveEventDirective,
        StackedAreaComponent,
    ],
})
export class ChartsModule {}
