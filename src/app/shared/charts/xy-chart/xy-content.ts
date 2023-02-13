import { Directive } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { Unsubscribe } from '../../unsubscribe.directive';
import { Ranges } from '../chart/chart.component';
import { XyChartComponent } from './xy-chart.component';

@Directive()
export abstract class XyContent extends Unsubscribe {
    xScale: any;
    yScale: any;
    categoryScale: any;
    ranges: Ranges;

    constructor(public chart: XyChartComponent) {
        super();
    }

    subscribeToRanges(): void {
        this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
            this.ranges = ranges;
            if (this.xScale && this.yScale) {
                this.resizeMarks();
            }
        });
    }

    subscribeToScales(): void {
        const subscriptions = [this.chart.xScale$, this.chart.yScale$, this.chart.categoryScale$];
        combineLatest(subscriptions)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([xScale, yScale, categoryScale]): void => {
                this.xScale = xScale;
                this.yScale = yScale;
                this.categoryScale = categoryScale;
            });
    }

    abstract resizeMarks(): void;
}
