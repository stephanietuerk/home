import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboboxModule } from 'src/app/shared/components/combobox/combobox.module';
import { FormComponentsModule } from 'src/app/shared/components/form-components/form-components.module';
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
  ColorForFieldPipe,
  RankReadoutPipe,
  TenureReadoutPipe,
} from './art-history-fields.pipe';
import { ArtHistoryJobsComponent } from './art-history-jobs.component';
import { ExploreChangeChartComponent } from './explore/explore-change-chart/explore-change-chart.component';
import { ExploreSelectionsComponent } from './explore/explore-selections/explore-selections.component';
import { YearsSelectionComponent } from './explore/explore-selections/years-selection/years-selection.component';
import { ExploreTimeRangeChartComponent } from './explore/explore-time-range-chart/explore-time-range-chart.component';
import { ExploreComponent } from './explore/explore.component';
import { JobChartComponent } from './schools/job-chart/job-chart.component';
import { SchoolChartComponent } from './schools/school-chart/school-chart.component';
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
    ExploreTimeRangeChartComponent,
    ExploreChangeChartComponent,
    ExploreSelectionsComponent,
    YearsSelectionComponent,
    SchoolsComponent,
    SchoolChartComponent,
    JobChartComponent,
    ColorForFieldPipe,
    TenureReadoutPipe,
    RankReadoutPipe,
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
  ],
})
export class ArtHistoryJobsModule {}
