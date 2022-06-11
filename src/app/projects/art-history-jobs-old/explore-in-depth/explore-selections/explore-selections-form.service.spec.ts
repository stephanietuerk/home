import { TestBed } from '@angular/core/testing';

import { ExploreSelectionsFormService } from './explore-selections-form.service';

describe('ExploreSelectionsFormService', () => {
  let service: ExploreSelectionsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExploreSelectionsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
