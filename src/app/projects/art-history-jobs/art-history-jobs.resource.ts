import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PerformanceOverviewResource {
    constructor(private http: HttpClient) {}

    getClientGroupTableConfig(): Observable<OverviewTableHeader[]> {
        return this.http.get<OverviewTableHeader[]>(
            `./assets/configs/performance-overview/client-group-overview-table.config.json`
        );
    }

    getMeasureTableConfig(): Observable<OverviewTableHeader[]> {
        return this.http.get<OverviewTableHeader[]>(
            `./assets/configs/performance-overview/measure-overview-table.config.json`
        );
    }
}
