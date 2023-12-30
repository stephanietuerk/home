import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobChartComponent } from './job-chart.component';

describe('JobChartComponent', () => {
  let component: JobChartComponent;
  let fixture: ComponentFixture<JobChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobChartComponent],
    });
    fixture = TestBed.createComponent(JobChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
