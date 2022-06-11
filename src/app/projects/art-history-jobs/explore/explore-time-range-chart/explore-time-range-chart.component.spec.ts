import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreTimeRangeChartComponent } from './explore-time-range-chart.component';

describe('ExploreTimeRangeChartComponent', () => {
  let component: ExploreTimeRangeChartComponent;
  let fixture: ComponentFixture<ExploreTimeRangeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreTimeRangeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreTimeRangeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
