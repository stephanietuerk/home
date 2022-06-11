import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { JobDatum } from './models/art-history-data';

@Injectable({
    providedIn: 'root',
})
export class ArtHistoryDataService {
    constructor(private http: HttpClient) {}

    getData(): Observable<JobDatum[]> {
        return this.http.get('assets/artHistoryJobs/aggregated_data.csv', { responseType: 'text' }).pipe(
            map((data) => this.parseData(data)),
            shareReplay()
        );
    }

    parseData(data): JobDatum[] {
        return csvParse(data).map((x) => {
            return {
                year: +x.year,
                field: x.field,
                isTt: x.is_tt.toLowerCase(),
                rank: x.rank.split(', '),
                count: +x.count,
            };
        });
    }
}
