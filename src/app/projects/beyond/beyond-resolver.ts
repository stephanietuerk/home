import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BeyondService } from './services/beyond.service';

@Injectable({ providedIn: 'root' })
export class BeyondResolver implements Resolve<any> {
    constructor(private service: BeyondService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return this.service.getBeyondData();
    }
}
