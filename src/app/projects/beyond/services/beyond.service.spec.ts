import { TestBed } from '@angular/core/testing';

import { BeyondService } from './beyond.service';

describe('BeyondService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeyondService = TestBed.get(BeyondService);
    expect(service).toBeTruthy();
  });
});
