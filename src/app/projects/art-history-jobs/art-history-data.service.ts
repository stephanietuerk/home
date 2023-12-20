import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { JobDatum, JobsByCountry } from './art-history-data.model';
import { ArtHistoryUtilities } from './art-history.utilities';

@Injectable({
  providedIn: 'root',
})
export class ArtHistoryDataService {
  data$: Observable<JobDatum[]>;
  dataBySchool$: Observable<JobsByCountry[]>;
  dataYears: [number, number];

  constructor(private http: HttpClient) {}

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.setData();
      this.setDataBySchools();
      this.data$.subscribe((data) => {
        this.dataYears = this.getDataYears(data);
        resolve();
      });
    });
  }

  setData(): void {
    this.data$ = this.http
      .get('assets/artHistoryJobs/aggregated_data.csv', {
        responseType: 'text',
      })
      .pipe(
        map((data) => this.parseData(data)),
        shareReplay(1)
      );
  }

  setDataBySchools(): void {
    this.dataBySchool$ = this.http
      .get<JobsByCountry[]>('assets/artHistoryJobs/jobsByCountry.json')
      .pipe(shareReplay(1));
  }

  parseData(data): JobDatum[] {
    return csvParse(data).map((x) => {
      return {
        year: new Date(`${x['year']}-01-01T00:00:00`),
        field: x['field'] === 'all' ? 'All' : x['field'],
        isTt: ArtHistoryUtilities.transformIsTt(x['is_tt']),
        rank: ArtHistoryUtilities.transformRank(x['rank']),
        count: +x['count'],
      };
    });
  }

  getDataYears(data: JobDatum[]): [number, number] {
    const years = [];
    data.forEach((x) => {
      if (!years.includes(x.year.getFullYear())) {
        years.push(x.year.getFullYear());
      }
    });
    years.sort((a, b) => a - b);
    return [years[0], years[years.length - 1]];
  }
}
