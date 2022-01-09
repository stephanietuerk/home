import { TestBed } from '@angular/core/testing';

import { ArtHistoryJobsService } from './art-history-jobs.service';

describe('ArtHistoryJobsService', () => {
  let service: ArtHistoryJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtHistoryJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
