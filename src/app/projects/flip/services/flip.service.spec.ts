import { TestBed } from '@angular/core/testing';
import { FlipService } from './flip.service';

describe('ProjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlipService = TestBed.get(FlipService);
    expect(service).toBeTruthy();
  });
});
