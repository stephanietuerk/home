import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { map, Observable, shareReplay } from 'rxjs';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case/sentence-case.pipe';
import { JobDatum, JobsByCountry } from './art-history-data.model';

@Injectable({
    providedIn: 'root',
})
export class ArtHistoryDataService {
    data$: Observable<JobDatum[]>;
    dataBySchool$: Observable<JobsByCountry>;

    constructor(private http: HttpClient, private sentenceCase: SentenceCasePipe) {}

    getData(): void {
        this.data$ = this.http.get('assets/artHistoryJobs/aggregated_data.csv', { responseType: 'text' }).pipe(
            map((data) => this.parseData(data)),
            shareReplay(1)
        );
        this.dataBySchool$ = this.http
            .get<JobsByCountry>('assets/artHistoryJobs/jobsByCountry.json')
            .pipe(shareReplay(1));
    }

    parseData(data): JobDatum[] {
        return csvParse(data).map((x) => {
            return {
                year: new Date(`${x.year}-01-01T00:00:00`),
                field: x.field === 'all' ? 'All' : x.field,
                isTt: this.transformIsTt(x.is_tt),
                rank: this.transformRank(x.rank),
                count: +x.count,
            };
        });
    }

    transformIsTt(isTt: string): string {
        if (isTt.toLowerCase() === 'true') {
            return 'Tenure track';
        } else if (isTt.toLowerCase() === 'false') {
            return 'Non-tenure track';
        } else {
            return this.sentenceCase.transform(isTt);
        }
    }

    transformRank(rank: string): string[] {
        const transformedRank = rank.split(', ');
        return transformedRank.map((str) => {
            switch (str) {
                case 'assistant_prof':
                    return 'Assistant professor';
                case 'associate_prof':
                    return 'Associate professor';
                case 'full_prof':
                    return 'Full professor';
                case 'chair':
                    return 'Chair';
                case 'open_rank':
                    return 'Open rank';
                case 'vap':
                    return 'Visiting position';
                case 'postdoc':
                    return 'Postdoc';
                case 'lecturer':
                    return 'Lecturer';
                case 'unknown':
                    return 'Unknown';
                default:
                    return this.sentenceCase.transform(str);
            }
        });
    }
}
