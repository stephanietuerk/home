import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';
import { CHART } from '../chart/chart.token';

/**
 * A `Chart` component to be used with `DataMarks` components that have X and Y axes, such as `Bars` and `Lines`.
 *
 * This component adds x, y, and category scales to the base `ChartComponent` that can
 *  be used by any components projected into the chart.
 *
 * <p class="comment-slots">Content projection slots</p>
 *
 * `html-elements-before`: Elements that will be projected before the chart's scaled div
 *  and scaled svg element in the DOM. USeful for adding elements that require access to chart scales.
 *
 * `svg-defs`: Used to create any required defs for the chart's svg element. For example, patterns or gradients.
 *
 * `svg-elements`: Used for all elements that should be children of the chart's scaled svg element.
 *
 * `html-elements-after`: Elements that will be projected after the chart's scaled div
 *  and scaled svg element in the DOM. USeful for adding elements that require access to chart scales.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'vic-xy-chart',
  templateUrl: '../chart/chart.component.html',
  styleUrls: ['../chart/chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CHART, useExisting: ChartComponent }],
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
