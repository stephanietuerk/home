import { Component, OnInit } from '@angular/core';
import { ascending } from 'd3';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArtHistoryDataService } from '../art-history-data.service';
import { JobDatum } from '../models/art-history-data';

@Component({
    selector: 'app-explore-in-depth',
    templateUrl: './explore-in-depth.component.html',
    styleUrls: ['./explore-in-depth.component.scss'],
})
export class ExploreInDepthComponent implements OnInit {
    // lineChartOptions: LineChartOptions;
    // lineChartData: any[];
    yearsRange$: Observable<number[]>;
    constructor(private dataService: ArtHistoryDataService) {}

    ngOnInit(): void {
        const data$ = this.dataService.getData();
        this.yearsRange$ = data$.pipe(map((data) => this.getYearsRange(data)));
        // this.subscribeToData();
    }

    getYearsRange(data: JobDatum[]): number[] {
        const uniqueYears = [...new Set(data.map((x) => +x.year))];
        uniqueYears.sort(ascending);
        return [uniqueYears[0], uniqueYears[uniqueYears.length - 1]];
    }

    // subscribeToData(): void {
    //     this.artHistoryJobsService.lineChartData.subscribe((data) => {
    //         this.setLineChartData(data);
    //         this.setLineChartOptions();
    //     });
    // }

    // setLineChartData(data: any): void {
    //     this.lineChartData = data;
    // }

    // setLineChartOptions(): void {
    //     const isPercent = this.artHistoryJobsService.selections.dataType === 'percent';
    //     const valueAccessor = isPercent ? 'percent' : 'count';
    //     const colorScale = this.getColorScale();

    //     const options = new LineChartOptions();
    //     options.x.valueAccessor = (d) => d.year;
    //     options.x.scaleType = scaleLinear;
    //     options.x.valueFormat = '.0f';
    //     options.x.axis.show = true;
    //     options.x.axis.side = 'bottom';
    //     options.y.valueAccessor = (d) => d[valueAccessor];
    //     options.y.valueFormat = isPercent ? '.0%' : '.0f';
    //     options.y.axis.show = true;
    //     options.y.axis.side = 'left';
    //     options.category.valueAccessor = (d) => d[this.artHistoryJobsService.lineChartCategoriesAccessor];
    //     options.width = 800;
    //     options.height = 500;
    //     options.category.colorScale = (d) => colorScale(d);
    //     options.tooltipFormat = '.1f';
    //     options.showTooltip = true;
    //     options.y.domain = isPercent ? [0, 1] : undefined;
    //     options.usePointMarker = true;
    //     options.pointMarkerRadius = 4;
    //     options.labelLines = this.isDisaggregated();
    //     options.lineLabelsFormat = (d) => this.getLineName(d);
    //     this.lineChartOptions = options;
    // }

    // getColorScale(): (x: any) => any {
    //     if (this.artHistoryJobsService.selections.fields.length > 1) {
    //         return (d) => this.artHistoryJobsService.getColorForField(d);
    //     } else {
    //         const color = this.artHistoryJobsService.getColorForField(this.artHistoryJobsService.selections.fields[0]);
    //         return (d) => color;
    //     }
    // }

    // getLineName(x: string): string {
    //     switch (this.artHistoryJobsService.lineChartCategoriesAccessor) {
    //         case 'field':
    //             return x;
    //         case 'rank':
    //             return rankOptions.find((option) => option.value === x).label;
    //         case 'isTt':
    //             return tenureOptions.find((option) => option.value === x).label;
    //         default:
    //             return x;
    //     }
    // }

    // isDisaggregated(): boolean {
    //     return (
    //         this.artHistoryJobsService.selections.rank.type === 'disaggregate' ||
    //         this.artHistoryJobsService.selections.tenure.type === 'disaggregate'
    //     );
    // }
}
