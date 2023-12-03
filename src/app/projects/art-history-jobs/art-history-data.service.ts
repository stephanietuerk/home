import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case/sentence-case.pipe';
import { JobDatum, JobsByCountry } from './art-history-data.model';
import { ArtHistoryUtilities } from './art-history.utilities';

@Injectable({
  providedIn: 'root',
})
export class ArtHistoryDataService {
  data$: Observable<JobDatum[]>;
  dataBySchool$: Observable<JobsByCountry[]>;

  constructor(
    private http: HttpClient,
    private sentenceCase: SentenceCasePipe<string>
  ) {}

  getData(): void {
    this.data$ = this.http
      .get('assets/artHistoryJobs/aggregated_data.csv', {
        responseType: 'text',
      })
      .pipe(
        map((data) => this.parseData(data)),
        shareReplay(1)
      );
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
}
