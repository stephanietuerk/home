import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BeyondService } from './beyond.service';

@Injectable({ providedIn: 'root' })
export class BeyondResolver {
  constructor(private service: BeyondService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.service.getBeyondData();
  }
}
