import { Directive } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { Ranges } from '../chart/chart.component';
import { Unsubscribe } from '../shared/unsubscribe.class';
import { OrdinalQuantitativeChartComponent } from './ordinal-quantitative-chart.component';

@Directive()
export abstract class OrdinalQuantitativeContent extends Unsubscribe {
    ordinalScale: any;
    quantitativeScale: any;
    categoryScale: any;
    ranges: Ranges;

    constructor(public chart: OrdinalQuantitativeChartComponent) {
        super();
    }

    subscribeToRanges(): void {
        this.chart.ranges$.pipe(takeUntil(this.unsubscribe)).subscribe((ranges) => {
            this.ranges = ranges;
            if (this.ordinalScale && this.quantitativeScale) {
                this.resizeMarks();
            }
        });
    }

    subscribeToScales(): void {
        const subscriptions = [this.chart.ordinalScale$, this.chart.quantitativeScale$, this.chart.categoryScale$];
        combineLatest(subscriptions)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([ordinalScale, quantitativeScale, categoryScale]): void => {
                this.ordinalScale = ordinalScale;
                this.quantitativeScale = quantitativeScale;
                this.categoryScale = categoryScale;
            });
    }

    abstract resizeMarks(): void;
}
