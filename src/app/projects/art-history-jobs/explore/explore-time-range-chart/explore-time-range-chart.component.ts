import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { timeYear } from 'd3';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { grayLightest } from 'src/app/core/constants/colors.constants';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { DATA_MARKS } from 'src/app/shared/charts/data-marks/data-marks.token';
import { EventEffect } from 'src/app/shared/charts/events/effect';
import { HtmlTooltipConfig } from 'src/app/shared/charts/html-tooltip/html-tooltip.config';
import { EmitLinesTooltipData, LinesHoverAndMoveEffectDefaultStyles } from 'src/app/shared/charts/lines/lines-effects';
import {
    LinesEmittedOutput,
    LinesHoverAndMoveEventDirective,
} from 'src/app/shared/charts/lines/lines-hover-move-event.directive';
import { LINES } from 'src/app/shared/charts/lines/lines.component';
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
    dataType: string;
}

@Component({
    selector: 'app-explore-time-range-chart',
    templateUrl: './explore-time-range-chart.component.html',
    styleUrls: ['./explore-time-range-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: LINES, useExisting: ExploreTimeRangeChartComponent },
        { provide: DATA_MARKS, useExisting: ExploreTimeRangeChartComponent },
    ],
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
    tooltipConfig: BehaviorSubject<HtmlTooltipConfig> = new BehaviorSubject<HtmlTooltipConfig>(
        new HtmlTooltipConfig({ show: false })
    );
    tooltipConfig$ = this.tooltipConfig.asObservable();
    tooltipData: BehaviorSubject<LinesEmittedOutput> = new BehaviorSubject<LinesEmittedOutput>(null);
    tooltipData$ = this.tooltipData.asObservable();
    hoverEffects: EventEffect<LinesHoverAndMoveEventDirective>[] = [
        new LinesHoverAndMoveEffectDefaultStyles(),
        new EmitLinesTooltipData(),
    ];
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
                        dataType: !!selections ? selections.dataType : '',
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
            config.lineLabels.display = true;
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

    updateTooltipForNewOutput(data: LinesEmittedOutput): void {
        this.updateTooltipData(data);
        this.updateTooltipConfig(data);
    }

    updateTooltipData(data: LinesEmittedOutput): void {
        this.tooltipData.next(data);
    }

    updateTooltipConfig(data: LinesEmittedOutput): void {
        const config = new HtmlTooltipConfig();
        config.position.panelClass = 'explore-time-range-tooltip';
        config.size.minWidth = 200;
        if (data) {
            config.position.offsetX = data.positionX;
            config.position.offsetY = data.positionY - 16;
            config.show = true;
        } else {
            config.show = false;
        }
        this.tooltipConfig.next(config);
    }

    updateChartOnNewTooltipData(data: LinesEmittedOutput): void {
        if (data) {
            const { x, ...rest } = data;
            const transformedData: LinesEmittedOutput = {
                ...rest,
                x: x.split(' ')[3],
            };
            this.updateTooltipData(transformedData);
        }
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
