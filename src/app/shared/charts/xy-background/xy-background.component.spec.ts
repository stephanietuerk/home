import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { XYBackgroundComponent } from './xy-background.component';

describe('ChartBackgroundComponent', () => {
  let component: XYBackgroundComponent;
  let fixture: ComponentFixture<XYBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XYBackgroundComponent],
      providers: [XyChartComponent],
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
