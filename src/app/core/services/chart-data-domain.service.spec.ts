import { TestBed } from '@angular/core/testing';

import { ChartDataDomainService } from './chart-data-domain.service';

describe('ChartDataDomainService', () => {
  let service: ChartDataDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartDataDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
