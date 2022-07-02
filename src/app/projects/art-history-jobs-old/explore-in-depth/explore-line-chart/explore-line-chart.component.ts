import { Component, OnInit } from '@angular/core';
import { timeYear } from 'd3';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AxisConfig } from 'src/app/shared/components/charts/xy-chart-space/axis-config.model';
import { ElementSpacing } from 'src/app/shared/components/charts/xy-chart-space/xy-chart-space.model';
import { formatSpecifications } from '../../art-history-jobs.constants';
import { ArtHistoryJobsService } from '../../art-history-jobs.service';
import { JobDatum } from '../../models/art-history-data';
import { ExploreLinesConfig, ExploreLinesXAxisConfig, ExploreLinesYAxisConfig } from './explore-line-chart.model';

@Component({
    selector: 'app-explore-line-chart',
    templateUrl: './explore-line-chart.component.html',
    styleUrls: ['./explore-line-chart.component.scss'],
})
export class ExploreLineChartComponent implements OnInit {
    dataMarksConfig: ExploreLinesConfig;
    xAxisConfig: AxisConfig;
    yAxisConfig: AxisConfig;
    width: 800;
    height: 500;
    margin: ElementSpacing = {
        top: 36,
        right: 36,
        bottom: 36,
        left: 36,
    };
    chartBackgroundColor: string = 'whitesmoke';

    constructor(private artHistoryJobsService: ArtHistoryJobsService, utilitiesService: UtilitiesService) {}

    ngOnInit(): void {
        this.subscribeToData();
    }

    subscribeToData(): void {
        this.artHistoryJobsService.lineChartData.subscribe((data) => {
            if (
                data &&
                this.artHistoryJobsService.selections.dataType &&
                this.artHistoryJobsService.lineChartCategoriesAccessor
            ) {
                this.dataMarksConfig = this.getNewDataMarksConfig(data);
                this.xAxisConfig = this.getNewXAxisConfig();
                this.yAxisConfig = this.getNewYAxisConfig();
            }
        });
    }

    getNewDataMarksConfig(data: JobDatum[]): ExploreLinesConfig {
        const config = new ExploreLinesConfig();
        config.data = data;
        config.y.valueAccessor = (d: JobDatum[]) => d[this.artHistoryJobsService.selections.dataType];
        config.y.valueFormat = formatSpecifications.explore.chart.value[this.artHistoryJobsService.selections.dataType];
        config.category.valueAccessor = (d: JobDatum[]) => d[this.artHistoryJobsService.lineChartCategoriesAccessor];
        config.category.colorScale = this.getColorScale();
        return config;
    }

    getColorScale(): (x: any) => any {
        if (this.artHistoryJobsService.selections.fields.length > 1) {
            return (d) => this.artHistoryJobsService.getColorForField(d);
        } else {
            const color = this.artHistoryJobsService.getColorForField(this.artHistoryJobsService.selections.fields[0]);
            return (d) => color;
        }
    }

    getNewXAxisConfig() {
        const config = new ExploreLinesXAxisConfig();
        config.numTicks = timeYear;
        return config;
    }

    getNewYAxisConfig() {
        const config = new ExploreLinesYAxisConfig();
        config.tickFormat = formatSpecifications.explore.chart.tick[this.artHistoryJobsService.selections.dataType];
        return config;
    }
}
