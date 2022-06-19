import { Component, Input, OnInit } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { Observable } from 'rxjs';
import { map, pairwise, takeUntil } from 'rxjs/operators';
import { XYAxisElement } from '../xy-chart-space/xy-axis.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[y-axis]',
    templateUrl: './y-axis.component.html',
    styleUrls: ['./y-axis.component.scss'],
})
export class YAxisComponent extends XYAxisElement implements OnInit {
    @Input() side: 'left' | 'right' = 'left';
    translate$: Observable<string>;

    setTranslate(): void {
        this.translate$ = this.chart.ranges$.pipe(
            map((ranges) => {
                let translate;
                if (this.side === 'left') {
                    translate = ranges.x[0];
                } else {
                    translate = ranges.x[1] - ranges.x[0] - this.chart.margin.right;
                }
                return `translate(${translate}, 0)`;
            })
        );
    }

    subscribeToScale(): void {
        this.xySpace.yScale$
            .pipe(takeUntil(this.unsubscribe), pairwise())
            .subscribe(([prev, curr]) => this.onScaleUpdate(prev, curr));
    }

    setAxisFunction(): void {
        this.axisFunction = this.side === 'left' ? axisLeft : axisRight;
    }

    initNumTicks(): number {
        return this.chart.height / 50; // default in D3 example
    }
}
