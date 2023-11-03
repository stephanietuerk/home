import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinalQuantitativeChartComponent } from './ordinal-quantitative-chart.component';

describe('OrdinalQuantitativeChartComponent', () => {
  let component: OrdinalQuantitativeChartComponent;
  let fixture: ComponentFixture<OrdinalQuantitativeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdinalQuantitativeChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdinalQuantitativeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
