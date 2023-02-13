import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';
import { CHART } from '../chart/chart.token';

@Component({
  selector: 'app-xy-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CHART, useExisting: XyChartComponent }],
})
export class XyChartComponent extends ChartComponent implements Chart, OnInit {
  private xScale: BehaviorSubject<any> = new BehaviorSubject(null);
  xScale$ = this.xScale.asObservable();
  private yScale: BehaviorSubject<any> = new BehaviorSubject(null);
  yScale$ = this.yScale.asObservable();
  private categoryScale: BehaviorSubject<any> = new BehaviorSubject(null);
  categoryScale$ = this.categoryScale.asObservable();

  updateXScale(scale: any): void {
    this.xScale.next(scale);
  }

  updateYScale(scale: any): void {
    this.yScale.next(scale);
  }

  updateCategoryScale(scale: any): void {
    this.categoryScale.next(scale);
  }
}
