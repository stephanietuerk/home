import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArtHistoryJobsResource {
    constructor(private http: HttpClient) {}

    getData(): Observable<any> {
        return this.http.get('assets/artHistoryJobs/aggregated_data.csv', { responseType: 'text' });
    }
}
