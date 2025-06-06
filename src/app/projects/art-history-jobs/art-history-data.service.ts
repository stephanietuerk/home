import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { firstValueFrom, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { JobDatum, JobsByCountry } from './art-history-data.model';
import { ArtHistoryUtilities } from './art-history.utilities';

@Injectable({
  providedIn: 'root',
})
export class ArtHistoryDataService {
  private _initPromise?: Promise<void>;
  data$: Observable<JobDatum[]>;
  dataBySchool$: Observable<JobsByCountry[]>;
  dataYears: [number, number];

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    if (!this._initPromise) {
      this._initPromise = (async () => {
        this.setData();
        this.setDataBySchools();
        const data = await firstValueFrom(this.data$);
        this.dataYears = this.getDataYears(data);
      })();
    }
    return this._initPromise;
  }

  setData(): void {
    if (!this.data$) {
      this.data$ = this.http
        .get('assets/artHistoryJobs/aggregated_data.csv', {
          responseType: 'text',
        })
        .pipe(
          map((data) => this.parseData(data)),
          shareReplay(1)
        );
    }
  }

  setDataBySchools(): void {
    if (!this.dataBySchool$) {
      this.dataBySchool$ = this.http
        .get<JobsByCountry[]>('assets/artHistoryJobs/jobsByCountry.json')
        .pipe(
          map((data) => this.parseDataBySchools(data)),
          shareReplay(1)
        );
    }
  }

  parseData(data): JobDatum[] {
    return csvParse(data).map((x) => {
      return {
        year: new Date(Date.UTC(+x['year'], 0, 1)), // TODO: Fix needing the second day in order for the year to be correct
        field: x['field'] === 'all' ? 'All' : x['field'],
        tenure: ArtHistoryUtilities.transformIsTt(x['is_tt']),
        rank: ArtHistoryUtilities.transformRankMulti(x['rank']),
        count: +x['count'],
      };
    });
  }

  parseDataBySchools(data): JobsByCountry[] {
    return data.map((country) => {
      return {
        ...country,
        jobsBySchool: country.jobsBySchool.map((school) => {
          return {
            ...school,
            jobsByYear: school.jobsByYear.map((year) => {
              return {
                ...year,
                jobs: year.jobs.map((job) => {
                  return {
                    ...job,
                    rank: ArtHistoryUtilities.transformRankMulti(job.rank[0]),
                    tenure: ArtHistoryUtilities.transformIsTt(job.tenure),
                  };
                }),
              };
            }),
          };
        }),
      };
    });
  }

  getDataYears(data: JobDatum[]): [number, number] {
    const years = Array.from(
      new Set(data.map((x) => x.year.getUTCFullYear()))
    ).sort((a, b) => a - b);
    return [years[0], years[years.length - 1]];
  }
}
