import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { InternSet, map, max, min, range, scaleOrdinal, select, Transition } from 'd3';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';
import { ChartComponent } from '../chart/chart.component';
import { XYDataMarksComponent, XYDataMarksValues } from '../data-marks/data-marks.model';
import { DATA_MARKS_COMPONENT } from '../data-marks/data-marks.token';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { BarsConfig, BarsTooltipData } from './bars.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[data-marks-bars]',
    templateUrl: './bars.component.html',
    styleUrls: ['./bars.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: DATA_MARKS_COMPONENT, useExisting: BarsComponent }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarsComponent extends UnsubscribeDirective implements XYDataMarksComponent, OnChanges, OnInit {
    @ViewChild('bars', { static: true }) barsRef: ElementRef<SVGSVGElement>;
    @Input() config: BarsConfig;
    @Output() tooltipData = new EventEmitter<BarsTooltipData>();
    values: XYDataMarksValues = new XYDataMarksValues();
    hasBarsWithNegativeValues: boolean;
    bars;
    xScale: (x: any) => number;
    yScale: (x: any) => number;

    constructor(
        private utilities: UtilitiesService,
        public chart: ChartComponent,
        public xySpace: XYChartSpaceComponent
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
            this.setMethodsFromConfigAndDraw();
        }
    }

    ngOnInit(): void {
        this.subscribeToScales();
    }

    subscribeToScales(): void {
        const subscriptions = [this.xySpace.xScale, this.xySpace.yScale];
        combineLatest(subscriptions)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([xScale, yScale]): void => {
                this.xScale = xScale;
                this.yScale = yScale;
            });
    }

    resizeMarks(): void {
        if (this.values.x && this.values.y) {
            this.setRanges();
            this.setScaledSpaceProperties();
            this.drawMarks(0);
        }
    }

    setMethodsFromConfigAndDraw(): void {
        this.setValueArrays();
        this.initNonQuantitativeDomains();
        this.setValueIndicies();
        this.setHasBarsWithNegativeValues();
        this.initQuantitativeDomain();
        this.initCategoryScale();
        this.initRanges();
        this.setScaledSpaceProperties();
        this.drawMarks(this.config.transitionDuration);
    }

    setValueArrays(): void {
        this.values.x = map(this.config.data, this.config[this.config.dimensions.x].valueAccessor);
        this.values.y = map(this.config.data, this.config[this.config.dimensions.y].valueAccessor);
        this.values.category = map(this.config.data, this.config.category.valueAccessor);
    }

    initNonQuantitativeDomains(): void {
        if (this.config.ordinal.domain === undefined) {
            this.config.ordinal.domain = this.values[this.config.dimensions.ordinal];
        }
        if (this.config.category.domain === undefined) {
            this.config.category.domain = this.values.category;
        }
        this.config.ordinal.domain = new InternSet(this.config.ordinal.domain);
        this.config.category.domain = new InternSet(this.config.category.domain);
    }

    setValueIndicies(): void {
        this.values.indicies = range(this.values[this.config.dimensions.ordinal].length).filter((i) =>
            (this.config.ordinal.domain as InternSet).has(this.values[this.config.dimensions.ordinal][i])
        );
    }

    setHasBarsWithNegativeValues(): void {
        let dataMin;
        if (this.config.quantitative.domain === undefined) {
            dataMin = min([min(this.values[this.config.dimensions.quantitative]), 0]);
        } else {
            dataMin = this.config.quantitative.domain[0];
        }
        this.hasBarsWithNegativeValues = dataMin < 0;
    }

    initQuantitativeDomain(): void {
        if (this.config.quantitative.domain === undefined) {
            const dataMin = min([min(this.values[this.config.dimensions.quantitative]), 0]);
            const dataMax = max(this.values[this.config.dimensions.quantitative]);
            const domainMax = dataMax > 0 ? dataMax : this.config.positivePaddingForAllNegativeValues * dataMin * -1;
            this.config.quantitative.domain = [dataMin, domainMax];
        }
    }

    initCategoryScale(): void {
        if (this.config.category.colorScale === undefined) {
            this.config.category.colorScale = scaleOrdinal(
                new InternSet(this.config.category.domain),
                this.config.category.colors
            );
        }
    }

    initRanges(): void {
        if (this.config.ordinal.range === undefined) {
            this.setOrdinalRange();
        }
        if (this.config.quantitative.range === undefined) {
            this.setQuantitativeRange();
        }
    }

    setRanges(): void {
        this.setOrdinalRange();
        this.setQuantitativeRange();
    }

    setOrdinalRange(): void {
        if (this.config.dimensions.ordinal === 'x') {
            this.config.ordinal.range = this.chart.getXRange();
        } else {
            this.config.ordinal.range = this.chart.getYRange();
        }
    }

    setQuantitativeRange(): void {
        if (this.config.dimensions.ordinal === 'x') {
            this.config.quantitative.range = this.chart.getYRange();
        } else {
            this.config.quantitative.range = this.chart.getXRange();
        }
    }

    setScaledSpaceProperties(): void {
        if (this.config.dimensions.ordinal === 'x') {
            this.xySpace.updateXScale(this.getOrdinalScale());
            this.xySpace.updateYScale(this.getQuantitativeScale());
        } else {
            this.xySpace.updateXScale(this.getQuantitativeScale());
            this.xySpace.updateYScale(this.getOrdinalScale());
        }
    }

    getOrdinalScale(): any {
        return this.config.ordinal
            .scaleType(this.config.ordinal.domain, this.config.ordinal.range)
            .paddingInner(this.config.ordinal.paddingInner)
            .paddingOuter(this.config.ordinal.paddingOuter);
    }

    getQuantitativeScale(): any {
        return this.config.quantitative.scaleType(this.config.quantitative.domain, this.config.quantitative.range);
    }

    drawMarks(transitionDuration: number): void {
        this.drawBars(transitionDuration);
    }

    drawBars(transitionDuration: number): void {
        const t = select(this.chart.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
            SVGSVGElement,
            any,
            any,
            any
        >;

        this.bars = select(this.barsRef.nativeElement)
            .selectAll('rect')
            .data(this.values.indicies, (i: number) => this.values[this.config.dimensions.ordinal][i])
            .join(
                (enter) =>
                    enter
                        .append('rect')
                        .property('key', (i) => this.values[this.config.dimensions.ordinal][i])
                        .attr('fill', (i) => this.getBarColor(i))
                        .attr('x', (i) => this.getBarX(i))
                        .attr('y', (i) => this.getBarY(i))
                        .attr('width', (i) => this.getBarWidth(i))
                        .attr('height', (i) => this.getBarHeight(i)),
                (update) =>
                    update.call((update) =>
                        update
                            .transition(t as any)
                            .attr('x', (i) => this.getBarX(i))
                            .attr('y', (i) => this.getBarY(i))
                            .attr('width', (i) => this.getBarWidth(i))
                            .attr('height', (i) => this.getBarHeight(i))
                    ),
                (exit) =>
                    exit // TODO: fancy exit needs to be tested with actual/any data -- don't think it will work for both axes as is/copied from D3 example
                        .transition(t as any)
                        .delay((_, i) => i * 20)
                        .attr('y', this.yScale(0))
                        .attr('height', 0)
                        .remove()
            );
    }

    getBarColor(i: number): string {
        return this.config.category.colorScale(this.values[this.config.dimensions.ordinal][i]);
    }

    getBarX(i: number): number {
        if (this.config.dimensions.ordinal === 'x') {
            return this.getBarXOrdinal(i);
        } else {
            return this.getBarXQuantitative(i);
        }
    }

    getBarXOrdinal(i: number): number {
        return this.xScale(this.values.x[i]);
    }

    getBarXQuantitative(i: number): number {
        if (this.hasBarsWithNegativeValues) {
            if (this.values.x[i] < 0) {
                return this.xScale(this.values.x[i]);
            } else {
                return this.xScale(0);
            }
        } else {
            return this.xScale(this.config.quantitative.domain[0]);
        }
    }

    getBarY(i: number): number {
        return this.yScale(this.values.y[i]);
    }

    getBarWidth(i: number): number {
        if (this.config.dimensions.ordinal === 'x') {
            return this.getBarWidthOrdinal(i);
        } else {
            return this.getBarWidthQuantitative(i);
        }
    }

    getBarWidthOrdinal(i: number): number {
        return (this.xScale as any).bandwidth();
    }

    getBarWidthQuantitative(i: number): number {
        const origin = this.hasBarsWithNegativeValues ? 0 : this.config.quantitative.domain[0];
        return Math.abs(this.xScale(this.values.x[i]) - this.xScale(origin));
    }

    getBarHeight(i: number): number {
        if (this.config.dimensions.ordinal === 'x') {
            return this.getBarHeightQuantitative(i);
        } else {
            return this.getBarHeightOrdinal(i);
        }
    }

    getBarHeightOrdinal(i: number): number {
        return (this.yScale as any).bandwidth();
    }

    getBarHeightQuantitative(i: number): number {
        const origin = this.hasBarsWithNegativeValues ? 0 : this.config.quantitative.domain[0];
        return Math.abs(this.yScale(origin - this.values.y[i]));
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPointerEnter(event: PointerEvent) {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPointerLeave(event: PointerEvent) {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPointerMove(event: PointerEvent) {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onWheel(event: Event) {}
}
