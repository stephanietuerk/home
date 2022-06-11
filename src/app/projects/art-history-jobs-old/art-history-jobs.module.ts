import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'src/app/shared/components/charts/charts.module';
import { FormComponentsModule } from 'src/app/shared/components/form-components/form-components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArtHistoryJobsComponent } from './art-history-jobs.component';
import { ExploreChangeComponent } from './explore-in-depth/explore-change/explore-change.component';
import { ExploreInDepthComponent } from './explore-in-depth/explore-in-depth.component';
import { ExploreLineChartComponent } from './explore-in-depth/explore-line-chart/explore-line-chart.component';
import { ExploreSelectionsComponent } from './explore-in-depth/explore-selections/explore-selections.component';
import { FieldSelectionComponent } from './explore-in-depth/explore-selections/field-selection/field-selection.component';
import { FiltersSelectionComponent } from './explore-in-depth/explore-selections/filters-selection/filters-selection.component';
import { SelectionSectionComponent } from './explore-in-depth/explore-selections/selection-section/selection-section.component';
import { YearsSelectionComponent } from './explore-in-depth/explore-selections/years-selection/years-selection.component';
import { ArtHistoryStackedAreaChartComponent } from './jobs-by-field/art-history-stacked-area-chart/art-history-stacked-area-chart.component';
import { ArtHistoryTableComponent } from './jobs-by-field/art-history-table/art-history-table.component';
import { JobsByFieldComponent } from './jobs-by-field/jobs-by-field.component';

@NgModule({
    declarations: [
        ArtHistoryJobsComponent,
        JobsByFieldComponent,
        FieldSelectionComponent,
        ExploreInDepthComponent,
        ExploreSelectionsComponent,
        YearsSelectionComponent,
        FiltersSelectionComponent,
        ExploreLineChartComponent,
        ExploreChangeComponent,
        ArtHistoryTableComponent,
        ArtHistoryStackedAreaChartComponent,
        SelectionSectionComponent,
    ],
    imports: [CommonModule, SharedModule, ChartsModule, ReactiveFormsModule, FormComponentsModule],
    exports: [ArtHistoryJobsComponent],
})
export class ArtHistoryJobsModule {}
