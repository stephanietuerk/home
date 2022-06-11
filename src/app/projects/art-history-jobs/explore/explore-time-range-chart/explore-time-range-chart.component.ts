import { Component, OnInit } from '@angular/core';
import { timeYear } from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LinesTooltipData } from 'src/app/shared/components/charts/lines/lines.model';
import { ElementSpacing } from 'src/app/shared/components/charts/xy-chart-space/xy-chart-space.model';
import { artHistoryFields } from '../../art-history-fields.constants';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ExploreDataService } from '../explore-data.service';
import {
    ExploreTimeRangeChartConfig,
    ExploreTimeRangeChartData,
    ExploreTimeRangeXAxisConfig,
    ExploreTimeRangeYAxisConfig,
    LineCategoryType,
} from './explore-time-range-chart.model';

interface ViewModel {
    dataMarksConfig: ExploreTimeRangeChartConfig;
    xAxisConfig: ExploreTimeRangeXAxisConfig;
    yAxisConfig: ExploreTimeRangeXAxisConfig;
    lineCategoryLabel: string;
}

@Component({
    selector: 'app-explore-time-range-chart',
    templateUrl: './explore-time-range-chart.component.html',
    styleUrls: ['./explore-time-range-chart.component.scss'],
})
export class ExploreTimeRangeChartComponent implements OnInit {
    vm$: Observable<ViewModel>;
    width = 800;
    height = 500;
    margin: ElementSpacing = {
        top: 36,
        right: 36,
        bottom: 36,
        left: 36,
    };
    chartBackgroundColor: string = 'whitesmoke';
    tooltipData: BehaviorSubject<LinesTooltipData> = new BehaviorSubject<LinesTooltipData>(null);
    tooltipData$ = this.tooltipData.asObservable();

    constructor(private exploreDataService: ExploreDataService, private fieldsService: ArtHistoryFieldsService) {}

    ngOnInit(): void {
        this.vm$ = this.exploreDataService.timeRangeChartData$.pipe(
            map((chartData) => {
                console.log('chartData', chartData);
                if (chartData) {
                    return {
                        dataMarksConfig: this.getDataMarksConfig(chartData),
                        xAxisConfig: this.getXAxisConfig(chartData),
                        yAxisConfig: this.getYAxisConfig(chartData),
                        lineCategoryLabel: this.getLineCategoryLabel(chartData.categories),
                    };
                }
            })
        );
    }

    private getDataMarksConfig(chartData: ExploreTimeRangeChartData): ExploreTimeRangeChartConfig {
        const config = new ExploreTimeRangeChartConfig();
        config.data = chartData.data;
        config.y.valueAccessor = (d: any) => d[chartData.dataType];
        config.y.valueFormat = artHistoryFormatSpecifications.explore.chart.value[chartData.dataType];
        config.category.valueAccessor = (d: any) => d[chartData.categories];
        config.category.colorScale = this.getColorScale(chartData.categories);
        console.log('dataMarksConfig', config);
        return config;
    }

    getColorScale(categoriesType: LineCategoryType): (x: any) => any {
        if (categoriesType === 'field') {
            return (d) => this.fieldsService.getColorForField(d);
        } else {
            const color = this.fieldsService.getColorForField(artHistoryFields[0].name.full);
            return (d) => color;
        }
    }

    private getXAxisConfig(chartData: ExploreTimeRangeChartData): ExploreTimeRangeXAxisConfig {
        const config = new ExploreTimeRangeXAxisConfig();
        config.numTicks = timeYear;
        return config;
    }

    private getYAxisConfig(chartData: ExploreTimeRangeChartData): ExploreTimeRangeYAxisConfig {
        const config = new ExploreTimeRangeYAxisConfig();
        config.tickFormat = artHistoryFormatSpecifications.explore.chart.tick[chartData.dataType];
        return config;
    }

    private getLineCategoryLabel(lineType: LineCategoryType): string {
        if (lineType === 'field') {
            return '';
        } else if (lineType === 'isTt') {
            return 'Tenure status';
        } else if (lineType === 'rank') {
            return 'Rank';
        }
    }

    updateChartOnNewTooltipData(data: LinesTooltipData): void {
        // const transformedData: LinesTooltipData = {
        //     ...data,
        //     x: data.x.split(' ')[3],
        // };
        // this.updateTooltipData(transformedData);
    }

    updateTooltipData(data: LinesTooltipData): void {
        this.tooltipData.next(data);
    }
}
