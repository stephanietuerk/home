import { Component, OnInit } from '@angular/core';
import { max, min } from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobDatum } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { ExploreTimeRangeChartConfig } from './explore-across-time-chart/explore-across-time-chart.model';
import { ExploreDataService } from './explore-data.service';
import { ExploreSelections } from './explore-selections/explore-selections.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  selections: BehaviorSubject<ExploreSelections> = new BehaviorSubject(null);
  selections$ = this.selections.asObservable();
  yearsRange$: Observable<[number, number]>;

  constructor(
    private dataService: ArtHistoryDataService,
    public exploreDataService: ExploreDataService
  ) {}

  ngOnInit(): void {
    this.yearsRange$ = this.dataService.data$.pipe(
      map((data: JobDatum[]) => this.getYearsRange(data))
    );
  }

  getYearsRange(data: JobDatum[]): [number, number] {
    const years = [...new Set(data.map((d) => d.year.getFullYear()))];
    return [min(years), max(years)];
  }

  getChangeChartConfig(data: JobDatum[]): any {
    throw new Error('Method not implemented.');
  }

  getTimeRangeChartConfig(
    data: JobDatum[],
    selections: ExploreSelections
  ): ExploreTimeRangeChartConfig {
    return new ExploreTimeRangeChartConfig();
  }
}
