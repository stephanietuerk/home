import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { CheckboxInputComponent } from './components/checkbox-input/checkbox-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { RadioInputComponent } from './components/radio-input/radio-input.component';
import { SortArrowsComponent } from './components/sort-arrows/sort-arrows.component';
import { StackedAreaChartComponent } from './components/stacked-area-chart/stacked-area-chart.component';
import { StackedAreaTooltipComponent } from './components/stacked-area-chart/stacked-area-tooltip/stacked-area-tooltip.component';
import { TableComponent } from './components/table/table.component';
import { ContentNavbarComponent } from './content-navbar/content-navbar.component';
import { HighlightRowOnHoverDirective } from './directives/highlight-row-on-hover.directive';
import { HoverClassOnSiblingsDirective } from './directives/hover-class-on-siblings.directive';
import { FormatForIdPipe } from './pipes/formatForId/formatForId.pipe';
import { SafePipe } from './pipes/safeHtml/safe.pipe';
import { StylesDisplayComponent } from './styles-display/styles-display.component';
import { SvgDefinitionsComponent } from './svg-icon/svg-definitions.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

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
        FormatForIdPipe,
        SafePipe,
        TableComponent,
        SortArrowsComponent,
        StackedAreaChartComponent,
        StackedAreaTooltipComponent,
        CheckboxInputComponent,
        CheckboxGroupComponent,
    ],
    imports: [CommonModule, RouterModule],
    exports: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        HighlightRowOnHoverDirective,
        HoverClassOnSiblingsDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
        RadioGroupComponent,
        FormatForIdPipe,
        SafePipe,
        TableComponent,
        SortArrowsComponent,
        StackedAreaChartComponent,
        StackedAreaTooltipComponent,
        CheckboxInputComponent,
        RadioInputComponent,
        CheckboxGroupComponent,
    ],
})
export class SharedModule {}
