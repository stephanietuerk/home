import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ArtHistoryJobsService } from './art-history-jobs.service';

@Injectable({ providedIn: 'root' })
export class ArtHistoryJobsResolver implements Resolve<any> {
    constructor(private service: ArtHistoryJobsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.service.getData();
    }
}
