import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { max, min } from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobDatum } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { ExploreAcrossTimeChartComponent } from './explore-across-time-chart/explore-across-time-chart.component';
import { ExploreChangeChartComponent } from './explore-change-chart/explore-change-chart.component';
import { ExploreDataService } from './explore-data.service';
import { ExploreSelectionsComponent } from './explore-selections/explore-selections.component';
import { ExploreSelections } from './explore-selections/explore-selections.model';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    ExploreSelectionsComponent,
    ExploreAcrossTimeChartComponent,
    ExploreChangeChartComponent,
  ],
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
}
