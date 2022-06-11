import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { CheckboxInputComponent } from './components/checkbox-input/checkbox-input.component';
import { ContentNavbarComponent } from './components/content-navbar/content-navbar.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { RadioInputComponent } from './components/radio-input/radio-input.component';
import { SortArrowsComponent } from './components/sort-arrows/sort-arrows.component';
import { StackedAreaChartComponent } from './components/stacked-area-chart/stacked-area-chart.component';
import { StackedAreaTooltipComponent } from './components/stacked-area-chart/stacked-area-tooltip/stacked-area-tooltip.component';
import { SvgDefinitionsComponent } from './components/svg-icon/svg-definitions.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { TableComponent } from './components/table/table.component';
import { HighlightRowOnHoverDirective } from './directives/highlight-row-on-hover.directive';
import { HoverClassOnSiblingsDirective } from './directives/hover-class-on-siblings.directive';
import { PipesModule } from './pipes/pipes.module';
import { StylesDisplayComponent } from './styles-display/styles-display.component';

@NgModule({
    declarations: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        HighlightRowOnHoverDirective,
        HoverClassOnSiblingsDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
        RadioGroupComponent,
        RadioInputComponent,
        TableComponent,
        SortArrowsComponent,
        StackedAreaChartComponent,
        StackedAreaTooltipComponent,
        CheckboxInputComponent,
        CheckboxGroupComponent,
        LineChartComponent,
    ],
    imports: [CommonModule, RouterModule, PipesModule],
    exports: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        HighlightRowOnHoverDirective,
        HoverClassOnSiblingsDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
        RadioGroupComponent,
        TableComponent,
        SortArrowsComponent,
        StackedAreaChartComponent,
        StackedAreaTooltipComponent,
        CheckboxInputComponent,
        RadioInputComponent,
        CheckboxGroupComponent,
        LineChartComponent,
    ],
})
export class SharedModule {}
