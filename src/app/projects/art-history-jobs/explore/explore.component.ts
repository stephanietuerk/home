import { Component, OnInit } from '@angular/core';
import { max, min } from 'd3';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JobDatum } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { ExploreSelections } from './explore-selections/explore-selections.model';
import { ExploreTimeRangeChartConfig } from './explore-time-range-chart/explore-time-range-chart.model';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
    selections: BehaviorSubject<ExploreSelections> = new BehaviorSubject(null);
    selections$ = this.selections.asObservable();
    yearsRange$: Observable<[number, number]>;

    constructor(private dataService: ArtHistoryDataService) {}

    ngOnInit(): void {
        const data$ = this.dataService.getData();
        this.yearsRange$ = data$.pipe(map((data: JobDatum[]) => this.getYearsRange(data)));
    }

    getYearsRange(data: JobDatum[]): [number, number] {
        const years = [...new Set(data.map((d) => d.year.getFullYear()))];
        return [min(years), max(years)];
    }

    getChangeChartConfig(data: JobDatum[]): any {
        throw new Error('Method not implemented.');
    }

    getTimeRangeChartConfig(data: JobDatum[], selections: ExploreSelections): ExploreTimeRangeChartConfig {
        return new ExploreTimeRangeChartConfig();
    }
}
