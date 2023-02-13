import { Directive, Input } from '@angular/core';
import { axisLeft, axisRight } from 'd3';
import { map, Observable } from 'rxjs';
import { Ranges } from '../../chart/chart.model';
import { AbstractConstructor } from '../../utilities/constructor';
import { XyAxis } from '../xy-axis';

export function mixinYAxis<T extends AbstractConstructor<XyAxis>>(Base: T) {
    @Directive()
    abstract class Mixin extends Base {
        @Input() side: 'left' | 'right' = 'left';
        translate$: Observable<string>;

        setTranslate(): void {
            this.translate$ = this.chart.ranges$.pipe(
                map((ranges) => {
                    const translate = this.getTranslateDistance(ranges);
                    return `translate(${translate}, 0)`;
                })
            );
        }

        getTranslateDistance(ranges: Ranges): number {
            return this.side === 'left' ? this.getLeftTranslate(ranges) : this.getRightTranslate(ranges);
        }

        getLeftTranslate(ranges: Ranges): number {
            return ranges.x[0];
        }

        getRightTranslate(ranges: Ranges): number {
            return ranges.x[1] - ranges.x[0] - this.chart.margin.right;
        }

        setScale(): void {
            this.subscribeToScale(this.xySpace.yScale$);
        }

        setAxisFunction(): void {
            this.axisFunction = this.side === 'left' ? axisLeft : axisRight;
        }

        initNumTicks(): number {
            return this.chart.height / 50; // default in D3 example
        }
    }

    return Mixin;
}
