import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  VicBarsModule,
  VicChartModule,
  VicHtmlTooltipModule,
  VicLinesModule,
  VicStackedAreaModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisModule,
  VicYQuantitativeAxisModule,
} from '@web-ast/viz-components';
import { FormComponentsModule } from 'src/app/shared/components/form-components/form-components.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
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
  ],
})
export class ArtHistoryJobsModule {}
