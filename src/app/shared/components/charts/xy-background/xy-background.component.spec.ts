import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { XYBackgroundComponent as XYBackgroundComponent } from './xy-background.component';

describe('ChartBackgroundComponent', () => {
  let component: XYBackgroundComponent;
  let fixture: ComponentFixture<XYBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XYBackgroundComponent],
      providers: [XYChartSpaceComponent, ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XYBackgroundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
