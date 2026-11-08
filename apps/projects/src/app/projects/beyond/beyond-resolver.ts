import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BeyondService } from './beyond.service';

@Injectable({ providedIn: 'root' })
export class BeyondResolver {
  constructor(private service: BeyondService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve(): Observable<any> | Promise<any> | any {
    return this.service.getBeyondData();
  }
}
