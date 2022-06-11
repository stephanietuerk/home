import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { area, extent, InternSet, map, range, rollup, scaleOrdinal, select, stack, Transition } from 'd3';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';
import { ChartComponent } from '../chart/chart.component';
import { XYDataMarksComponent, XYDataMarksValues } from '../data-marks/data-marks.model';
import { DATA_MARKS_COMPONENT } from '../data-marks/data-marks.token';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { StackedAreaConfig } from './stacked-area.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[data-marks-stacked-area]',
    templateUrl: './stacked-area.component.html',
    styleUrls: ['./stacked-area.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: DATA_MARKS_COMPONENT, useExisting: StackedAreaComponent }],
})
export class StackedAreaComponent extends UnsubscribeDirective implements XYDataMarksComponent, OnChanges, OnInit {
    @Input() config: StackedAreaConfig;
    xScale: (x: any) => number;
    yScale: (x: any) => number;
    values: XYDataMarksValues = new XYDataMarksValues();
    series: any;
    area: any;
    areas: any;

    constructor(
        private areasRef: ElementRef<SVGSVGElement>,
        protected utilities: UtilitiesService,
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
            this.setArea();
            this.drawMarks(0);
        }
    }

    setMethodsFromConfigAndDraw(): void {
        this.setChartTooltipProperty();
        this.setValueArrays();
        this.initXAndCategoryDomains();
        this.setValueIndicies();
        this.setSeries();
        this.initYDomain();
        this.initRanges();
        this.setScaledSpaceProperties();
        this.initCategoryScale();
        this.setArea();
        this.drawMarks(this.config.transitionDuration);
    }

    setChartTooltipProperty(): void {
        this.chart.htmlTooltip.exists = this.config.showTooltip;
    }

    setValueArrays(): void {
        this.values.x = map(this.config.data, this.config.x.valueAccessor);
        this.values.y = map(this.config.data, this.config.y.valueAccessor);
        this.values.category = map(this.config.data, this.config.category.valueAccessor);
    }

    initXAndCategoryDomains(): void {
        if (this.config.x.domain === undefined) {
            this.config.x.domain = extent(this.values.x);
        }
        if (this.config.category.domain === undefined) {
            this.config.category.domain = this.values.category;
        }
        this.config.category.domain = new InternSet(this.config.category.domain);
    }

    setValueIndicies(): void {
        this.values.indicies = range(this.values.x.length).filter((i) =>
            (this.config.category.domain as InternSet).has(this.values.category[i])
        );
    }

    setSeries(): void {
        const rolledUpData: Map<any, Map<any, number>> = rollup(
            this.values.indicies,
            ([i]) => i,
            (i) => this.values.x[i],
            (i) => this.values.category[i]
        );

        const keys = this.config.keyOrder ? this.config.keyOrder.slice().reverse() : this.config.category.domain;

        this.series = stack()
            .keys(keys)
            .value(([x, I]: any, category) => this.values.y[I.get(category)])
            .order(this.config.order)
            .offset(this.config.offset)(rolledUpData as any)
            .map((s) => s.map((d) => Object.assign(d, { i: (d.data[1] as any).get(s.key) })));
    }

    initYDomain(): void {
        if (this.config.y.domain === undefined) {
            this.config.y.domain = extent(this.series.flat(2));
            this.config.y.domain[0] = Math.floor(this.config.y.domain[0]);
            this.config.y.domain[1] = Math.ceil(this.config.y.domain[1]);
        }
    }

    initRanges(): void {
        if (this.config.x.range === undefined) {
            this.config.x.range = this.chart.getXRange();
        }
        if (this.config.y.range === undefined) {
            this.config.y.range = this.chart.getYRange();
        }
    }

    setRanges(): void {
        this.config.x.range = this.chart.getXRange();
        this.config.y.range = this.chart.getYRange();
    }

    setScaledSpaceProperties(): void {
        this.xySpace.updateXScale(this.config.x.scaleType(this.config.x.domain, this.config.x.range));
        this.xySpace.updateYScale(this.config.y.scaleType(this.config.y.domain, this.config.y.range));
    }

    initCategoryScale(): void {
        if (this.config.category.colorScale === undefined) {
            this.config.category.colorScale = scaleOrdinal(
                new InternSet(this.config.category.domain),
                this.config.category.colors
            );
        }
    }

    setArea(): void {
        this.area = area()
            .x(({ i }: any) => this.xScale(this.values.x[i]))
            .y0(([y1]) => this.yScale(y1))
            .y1(([, y2]) => this.yScale(y2))
            .curve(this.config.curve);
    }

    drawMarks(transitionDuration: number): void {
        this.drawAreas(transitionDuration);
    }

    drawAreas(transitionDuration: number): void {
        const t = select(this.chart.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
            SVGSVGElement,
            any,
            any,
            any
        >;

        this.areas = select(this.areasRef.nativeElement)
            .selectAll('path')
            .data(this.series)
            .join(
                (enter) =>
                    enter
                        .append('path')
                        .property('key', ([{ i }]) => this.values.category[i])
                        .attr('fill', ([{ i }]) => this.config.category.colorScale(this.values.category[i]))
                        .attr('d', this.area),
                (update) =>
                    update.call((update) =>
                        update
                            .transition(t as any)
                            .attr('d', this.area)
                            .attr('fill', ([{ i }]) => this.config.category.colorScale(this.values.category[i]))
                    ),
                (exit) => exit.remove()
            );
    }

    onPointerEnter(event: PointerEvent): void {}
    onPointerLeave(event: PointerEvent): void {}
    onPointerMove(event: PointerEvent): void {}
}
