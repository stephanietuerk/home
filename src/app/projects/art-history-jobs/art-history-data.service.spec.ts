import { TestBed } from '@angular/core/testing';

import { ArtHistoryDataService } from './art-history-data.service';

describe('ArtHistoryDataService', () => {
  let service: ArtHistoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtHistoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
