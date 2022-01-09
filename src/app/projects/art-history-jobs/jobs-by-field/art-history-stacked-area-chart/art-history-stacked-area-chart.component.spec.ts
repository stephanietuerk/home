import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtHistoryStackedAreaChartComponent } from './art-history-stacked-area-chart.component';

describe('ArtHistoryStackedAreaChartComponent', () => {
  let component: ArtHistoryStackedAreaChartComponent;
  let fixture: ComponentFixture<ArtHistoryStackedAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtHistoryStackedAreaChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtHistoryStackedAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
