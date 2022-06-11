import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtHistoryJobsComponent } from './art-history-jobs.component';

describe('ArtHistoryJobsComponent', () => {
  let component: ArtHistoryJobsComponent;
  let fixture: ComponentFixture<ArtHistoryJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtHistoryJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtHistoryJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
