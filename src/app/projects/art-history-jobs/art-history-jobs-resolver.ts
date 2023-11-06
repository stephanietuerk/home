import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ArtHistoryDataService } from './art-history-data.service';

@Injectable({ providedIn: 'root' })
export class ArtHistoryJobsResolver implements Resolve<any> {
  constructor(private service: ArtHistoryDataService) {}

  resolve(): void {
    return this.service.getData();
  }
}
