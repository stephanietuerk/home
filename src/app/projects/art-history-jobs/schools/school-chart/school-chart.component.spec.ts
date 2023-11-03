import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolChartComponent } from './school-chart.component';

describe('SchoolChartComponent', () => {
  let component: SchoolChartComponent;
  let fixture: ComponentFixture<SchoolChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
