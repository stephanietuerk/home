import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'src/app/shared/charts/charts.module';
import { FormComponentsModule } from 'src/app/shared/components/form-components/form-components.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArtHistoryJobsComponent } from './art-history-jobs.component';
import { ExploreChangeChartComponent } from './explore/explore-change-chart/explore-change-chart.component';
import { ExploreSelectionsComponent } from './explore/explore-selections/explore-selections.component';
import { YearsSelectionComponent } from './explore/explore-selections/years-selection/years-selection.component';
import { ExploreTimeRangeChartComponent } from './explore/explore-time-range-chart/explore-time-range-chart.component';
import { ExploreComponent } from './explore/explore.component';
import { SummaryChartComponent } from './summary/summary-chart/summary-chart.component';
import { SummaryTableComponent } from './summary/summary-table/summary-table.component';
import { SummaryComponent } from './summary/summary.component';
import { SchoolsComponent } from './schools/schools.component';
import { SchoolChartComponent } from './schools/school-chart/school-chart.component';
import { ItemsComponent } from './schools/items/items.component';

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
        ItemsComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ChartsModule,
        FormComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        OverlayModule,
    ],
})
export class ArtHistoryJobsModule {}
