import { Component, OnInit } from '@angular/core';
import { timeYear } from 'd3';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { LinesTooltipData } from 'src/app/shared/components/charts/lines/lines.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ExploreTimeRangeChartData, LineCategoryType } from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import { rankOptions, tenureOptions } from '../explore-selections/explore-selections.constants';
import { ExploreSelections } from '../explore-selections/explore-selections.model';
import {
    ExploreTimeRangeChartConfig,
    ExploreTimeRangeXAxisConfig,
    ExploreTimeRangeYAxisConfig,
} from './explore-time-range-chart.model';

interface ViewModel {
    dataMarksConfig: ExploreTimeRangeChartConfig;
    xAxisConfig: ExploreTimeRangeXAxisConfig;
    yAxisConfig: ExploreTimeRangeYAxisConfig;
    lineCategoryLabel: string;
    title: string;
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
        top: 4,
        right: 36,
        bottom: 36,
        left: 36,
    };
    tooltipData: BehaviorSubject<LinesTooltipData> = new BehaviorSubject<LinesTooltipData>(null);
    tooltipData$ = this.tooltipData.asObservable();
    chartBackgroundColor = grayLightest;

    constructor(public exploreDataService: ExploreDataService, private fieldsService: ArtHistoryFieldsService) {}

    ngOnInit(): void {
        this.vm$ = combineLatest([this.exploreDataService.chartsData$, this.exploreDataService.selections$]).pipe(
            map(([chartData, selections]) => {
                if (chartData.timeRange) {
                    return {
                        dataMarksConfig: this.getDataMarksConfig(chartData.timeRange),
                        xAxisConfig: this.getXAxisConfig(chartData.timeRange),
                        yAxisConfig: this.getYAxisConfig(chartData.timeRange),
                        lineCategoryLabel: this.getLineCategoryLabel(chartData.timeRange.categories),
                        title: !!selections ? this.getTitle(chartData.timeRange.categories, selections) : '',
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
        config.category.colorScale = this.getColorScale(chartData);
        if (chartData.categories !== 'field') {
            config.lineLabels.show = true;
            config.lineLabels.align = 'inside';
            config.lineLabels.format = (d: any) => this.getCategoryLabel(d, chartData.categories);
        }
        return config;
    }

    getColorScale(chartData: ExploreTimeRangeChartData): (x: any) => any {
        if (chartData.categories === 'field') {
            return (d) => this.fieldsService.getColorForField(d);
        } else {
            const color = this.fieldsService.getColorForField(chartData.data[0].field);
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
            return 'Field';
        } else if (lineType === 'isTt') {
            return 'Tenure status';
        } else if (lineType === 'rank') {
            return 'Rank';
        }
    }

    updateChartOnNewTooltipData(data: LinesTooltipData): void {
        if (data) {
            const { x, ...rest } = data;
            const transformedData: LinesTooltipData = {
                ...rest,
                x: x.split(' ')[3],
            };
            this.updateTooltipData(transformedData);
        }
    }

    updateTooltipData(data: LinesTooltipData): void {
        this.tooltipData.next(data);
    }

    getCategoryLabel(value: string, category: string): string {
        if (category === 'Field' || category === 'fields') {
            return value;
        } else if (category === 'Tenure status' || category === 'isTt') {
            return tenureOptions.find((x) => x.label === value).label;
        } else if (category === 'Rank' || category === 'rank') {
            return rankOptions.find((x) => x.label === value).label;
        }
    }

    getTitle(categories: LineCategoryType, selections: ExploreSelections): string {
        let fields;
        let disaggregation;
        if (categories === 'field') {
            disaggregation = 'by field';
            if (selections.dataType === 'count') {
                fields = '';
            } else {
                fields = 'all';
            }
        } else {
            fields = selections.fields.join('');
            if (categories === 'isTt') {
                disaggregation = 'by tenure status';
            } else {
                disaggregation = 'by rank';
            }
        }
        return `${selections.dataType} of ${fields.toLowerCase()} jobs ${disaggregation}`;
    }
}
