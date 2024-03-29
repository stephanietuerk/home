import { Directive, Input } from '@angular/core';
import { axisBottom, axisTop } from 'd3';
import { Observable, filter, map } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../xy-axis';

/**
 * A mixin that extends `XyAxis` with the functionality needed for an x-axis.
 *
 * For internal library use only.
 */
export function mixinXAxis<T extends AbstractConstructor<XyAxis>>(Base: T) {
  @Directive()
  abstract class Mixin extends Base {
    @Input() side: 'top' | 'bottom' = 'top';
    translate$: Observable<string>;

    setTranslate(): void {
      this.translate$ = this.chart.ranges$.pipe(
        map((ranges) => {
          const translate = this.getTranslateDistance(ranges);
          return `translate(0, ${translate})`;
        })
      );
    }

    getTranslateDistance(ranges: Ranges): number {
      return this.side === 'top'
        ? this.getTopTranslate(ranges)
        : this.getBottomTranslate(ranges);
    }

    getTopTranslate(ranges: Ranges): number {
      return ranges.y[1];
    }

    getBottomTranslate(ranges: Ranges): number {
      return ranges.y[0] - ranges.y[1] + this.chart.margin.top;
    }

    setScale(): void {
      const scales$ = this.chart.scales$.pipe(
        filter((scales) => !!scales && !!scales.x),
        map((scales) => {
          return { x: scales.x, useTransition: scales.useTransition };
        })
      );
      this.subscribeToScale(scales$);
    }

    setAxisFunction(): void {
      this.axisFunction = this.side === 'top' ? axisTop : axisBottom;
    }

    initNumTicks(): number {
      return this.chart.width / 40; // default in D3 example
    }
  }

  return Mixin;
}
