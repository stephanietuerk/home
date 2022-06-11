import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ArtHistoryDataService } from './art-history-data.service';

@Injectable({ providedIn: 'root' })
export class ArtHistoryJobsResolver implements Resolve<any> {
    constructor(private service: ArtHistoryDataService) {}

    resolve(): Observable<any> {
        return this.service.getData();
    }
}
