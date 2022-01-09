import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArtHistoryJobsComponent } from './art-history-jobs.component';
import { ExploreChangeComponent } from './explore-in-depth/explore-change/explore-change.component';
import { ExploreInDepthComponent } from './explore-in-depth/explore-in-depth.component';
import { ExploreLineComponent } from './explore-in-depth/explore-line/explore-line.component';
import { DataTypeSelectionComponent } from './explore-in-depth/selections/data-type-selection/data-type-selection.component';
import { FieldSelectionComponent } from './explore-in-depth/selections/field-selection/field-selection.component';
import { FiltersSelectionComponent } from './explore-in-depth/selections/filters-selection/filters-selection.component';
import { ArtHistorySelectionsComponent } from './explore-in-depth/selections/selections.component';
import { YearsSelectionComponent } from './explore-in-depth/selections/years-selection/years-selection.component';
import { ArtHistoryStackedAreaChartComponent } from './jobs-by-field/art-history-stacked-area-chart/art-history-stacked-area-chart.component';
import { ArtHistoryTableComponent } from './jobs-by-field/art-history-table/art-history-table.component';
import { JobsByFieldComponent } from './jobs-by-field/jobs-by-field.component';

@NgModule({
    declarations: [
        ArtHistoryJobsComponent,
        JobsByFieldComponent,
        FieldSelectionComponent,
        ExploreInDepthComponent,
        ArtHistorySelectionsComponent,
        YearsSelectionComponent,
        DataTypeSelectionComponent,
        FiltersSelectionComponent,
        ExploreLineComponent,
        ExploreChangeComponent,
        ArtHistoryTableComponent,
        ArtHistoryStackedAreaChartComponent,
    ],
    imports: [CommonModule, SharedModule],
    exports: [ArtHistoryJobsComponent],
})
export class ArtHistoryJobsModule {}
