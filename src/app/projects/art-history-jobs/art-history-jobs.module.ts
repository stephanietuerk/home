import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ComboboxModule } from 'src/app/shared/components/combobox/combobox.module';
import { FormComponentsModule } from 'src/app/shared/components/form-components/form-components.module';
import { FocusOnInitDirective } from 'src/app/shared/directives/focus-on-init.directive';
import { SubstringHighlightDirective } from 'src/app/shared/directives/substring-highlight.directive';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { VicXQuantitativeAxisModule } from 'src/app/viz-components/axes/x-quantitative/x-quantitative-axis.module';
import { VicYOrdinalAxisModule } from 'src/app/viz-components/axes/y-ordinal/y-ordinal-axis.module';
import { VicYQuantitativeAxisModule } from 'src/app/viz-components/axes/y-quantitative-axis/y-quantitative-axis.module';
import { VicBarsModule } from 'src/app/viz-components/bars/bars.module';
import { VicChartModule } from 'src/app/viz-components/chart/chart.module';
import { VicLinesModule } from 'src/app/viz-components/lines/lines.module';
import { VicStackedAreaModule } from 'src/app/viz-components/stacked-area/stacked-area.module';
import { VicHtmlTooltipModule } from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.module';
import { VicXyBackgroundModule } from 'src/app/viz-components/xy-background/xy-background.module';
import { VicXyChartModule } from 'src/app/viz-components/xy-chart/xy-chart.module';
import {
  CategoryLabelPipe,
  ColorForFieldPipe,
  D3FormatPipe,
  JobIsInFiltersPipe,
  RankReadoutPipe,
  TenureReadoutPipe,
  UniqueValuesPipe,
} from './art-history-fields.pipe';
import { ArtHistoryJobsComponent } from './art-history-jobs.component';
import { DataAcquisitionComponent } from './data-acquisition/data-acquisition.component';
import { ExploreAcrossTimeChartComponent } from './explore/explore-across-time-chart/explore-across-time-chart.component';
import { ChangeBarsComponent } from './explore/explore-change-chart/change-bars/change-bars.component';
import { ChangeChartToggleComponent } from './explore/explore-change-chart/change-chart-toggle/change-chart-toggle.component';
import { ChangeChartComponent } from './explore/explore-change-chart/change-chart/change-chart.component';
import { ChangeYAxisComponent } from './explore/explore-change-chart/change-y-axis/change-y-axis.component';
import { ExploreChangeChartComponent } from './explore/explore-change-chart/explore-change-chart.component';
import { ExploreSelectionsComponent } from './explore/explore-selections/explore-selections.component';
import { ValueTypeSelectionComponent } from './explore/explore-selections/value-type-selection/value-type-selection.component';
import { VariableSingleMultiSelectionComponent } from './explore/explore-selections/variable-single-multi-selection/variable-single-multi-selection.component';
import { VariableUseSelectionComponent } from './explore/explore-selections/variable-use-selection/variable-use-selection.component';
import { YearsSelectionComponent } from './explore/explore-selections/years-selection/years-selection.component';
import { ExploreComponent } from './explore/explore.component';
import { JobChartComponent } from './schools/job-chart/job-chart.component';
import { SchoolChartComponent } from './schools/school-chart/school-chart.component';
import { SchoolFiltersComponent } from './schools/school-filters/school-filters.component';
import { SchoolsComponent } from './schools/schools.component';
import { SummaryChartComponent } from './summary/summary-chart/summary-chart.component';
import { SummaryTableComponent } from './summary/summary-table/summary-table.component';
import { SummaryComponent } from './summary/summary.component';

@NgModule({
  declarations: [
    ArtHistoryJobsComponent,
    ExploreComponent,
    SummaryComponent,
    SummaryTableComponent,
    SummaryChartComponent,
    ExploreAcrossTimeChartComponent,
    ExploreChangeChartComponent,
    ExploreSelectionsComponent,
    YearsSelectionComponent,
    SchoolsComponent,
    SchoolChartComponent,
    JobChartComponent,
    SchoolFiltersComponent,
    DataAcquisitionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    OverlayModule,
    VicBarsModule,
    VicStackedAreaModule,
    VicHtmlTooltipModule,
    VicXyChartModule,
    VicChartModule,
    VicXyBackgroundModule,
    VicLinesModule,
    VicXQuantitativeAxisModule,
    VicYOrdinalAxisModule,
    VicBarsModule,
    VicYQuantitativeAxisModule,
    ComboboxModule,
    MatIconModule,
    MatExpansionModule,
    SubstringHighlightDirective,
    MatButtonToggleModule,
    ValueTypeSelectionComponent,
    VariableUseSelectionComponent,
    VariableSingleMultiSelectionComponent,
    ChangeBarsComponent,
    ChangeYAxisComponent,
    ChangeChartComponent,
    CategoryLabelPipe,
    D3FormatPipe,
    ColorForFieldPipe,
    TenureReadoutPipe,
    RankReadoutPipe,
    JobIsInFiltersPipe,
    UniqueValuesPipe,
    FocusOnInitDirective,
    A11yModule,
    ChangeChartToggleComponent,
  ],
})
export class ArtHistoryJobsModule {}
