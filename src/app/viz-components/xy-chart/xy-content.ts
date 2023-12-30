import { inject } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { Ranges } from '../chart/chart.component';
import { Unsubscribe } from '../shared/unsubscribe.class';
import {
  XyChartComponent,
  XyChartScales,
  XyContentScale,
} from './xy-chart.component';

/**
 * @internal
 */

export abstract class XyContent extends Unsubscribe {
  ranges: Ranges;
  scales: XyChartScales;
  public chart = inject(XyChartComponent);
  requiredScales: (keyof typeof XyContentScale)[];

  abstract setRequiredChartScales(): void;
  abstract setChartScales(useTransition: boolean): void;
  abstract drawMarks(): void;

  subscribeToRanges(): void {
    this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
      this.ranges = ranges;
      if (
        this.scales &&
        this.requiredScales.every((scale) => this.scales[scale])
      ) {
        this.resizeMarks();
      }
    });
  }

  subscribeToScales(): void {
    this.chart.scales$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((scales) => !!scales)
      )
      .subscribe((scales): void => {
        this.scales = scales;
        this.drawMarks();
      });
  }

  resizeMarks(): void {
    this.setChartScales(false);
  }

  getTransitionDuration(): number {
    return this.scales.useTransition ? this.chart.transitionDuration : 0;
  }
}
