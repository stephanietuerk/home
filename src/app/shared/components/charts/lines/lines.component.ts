import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    extent,
    format,
    group,
    InternSet,
    least,
    line,
    map as d3map,
    max,
    min,
    pointer,
    range,
    scaleOrdinal,
    select,
    timeFormat,
    Transition,
} from 'd3';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';
import { ChartComponent } from '../chart/chart.component';
import { Ranges } from '../chart/chart.model';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { XyDataMarks, XyDataMarksValues } from '../data-marks/xy-data-marks.model';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { LinesConfig, LinesTooltipData } from './lines.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[data-marks-lines]',
    templateUrl: './lines.component.html',
    styleUrls: ['./lines.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: DATA_MARKS, useExisting: LinesComponent }],
})
export class LinesComponent extends UnsubscribeDirective implements XyDataMarks, OnChanges, OnInit {
    @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
    @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
    @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
    @ViewChild('lineLabels', { static: true })
    lineLabelsRef: ElementRef<SVGSVGElement>;
    @Input() config: LinesConfig;
    @Output() tooltipData = new EventEmitter<LinesTooltipData>();
    xScale: (x: any) => number;
    yScale: (x: any) => number;
    line: (x: any[]) => any;
    values: XyDataMarksValues = new XyDataMarksValues();
    tooltipCurrentlyShown = false;
    ranges: Ranges;

    constructor(
        protected utilities: UtilitiesService,
        public chart: ChartComponent,
        public xySpace: XyChartSpaceComponent,
        private zone: NgZone
    ) {
        super();
    }

    get markers(): any {
        return select(this.markersRef.nativeElement).selectAll('circle');
    }

    get lines(): any {
        return select(this.linesRef.nativeElement).selectAll('path');
    }
    get hoverDot(): any {
        return select(this.dotRef.nativeElement).selectAll('circle');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
            this.setMethodsFromConfigAndDraw();
        }
    }

    ngOnInit(): void {
        this.subscribeToRanges();
        this.subscribeToScales();
        this.setMethodsFromConfigAndDraw();
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
        const subscriptions = [this.xySpace.xScale$, this.xySpace.yScale$];
        combineLatest(subscriptions)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([xScale, yScale]): void => {
                this.xScale = xScale;
                this.yScale = yScale;
            });
    }

    setMethodsFromConfigAndDraw(): void {
        this.setChartTooltipProperty();
        this.setValueArrays();
        this.initDomains();
        this.setValueIndicies();
        this.setScaledSpaceProperties();
        this.initCategoryScale();
        this.setLine();
        this.drawMarks(this.chart.transitionDuration);
    }

    resizeMarks(): void {
        this.setScaledSpaceProperties();
        this.setLine();
        this.drawMarks(0);
    }

    setChartTooltipProperty(): void {
        this.chart.htmlTooltip.exists = this.config.showTooltip;
    }

    setValueArrays(): void {
        this.values.x = d3map(this.config.data, this.config.x.valueAccessor);
        this.values.y = d3map(this.config.data, this.config.y.valueAccessor);
        this.values.category = d3map(this.config.data, this.config.category.valueAccessor);
    }

    initDomains(): void {
        if (this.config.x.domain === undefined) {
            this.config.x.domain = extent(this.values.x);
        }
        if (this.config.y.domain === undefined) {
            const dataMin = min([min(this.values.y), 0]);
            this.config.y.domain = [dataMin, max(this.values.y)];
        }
        if (this.config.category.domain === undefined) {
            this.config.category.domain = this.values.category;
        }
    }

    setValueIndicies(): void {
        this.values.indicies = range(this.values.x.length).filter((i) =>
            new InternSet(this.config.category.domain).has(this.values.category[i])
        );
    }

    setScaledSpaceProperties(): void {
        const x = this.config.x.scaleType(this.config.x.domain, this.ranges.x);
        const y = this.config.y.scaleType(this.config.y.domain, this.ranges.y);
        this.zone.run(() => {
            this.xySpace.updateXScale(x);
            this.xySpace.updateYScale(y);
        });
    }

    initCategoryScale(): void {
        if (this.config.category.colorScale === undefined) {
            this.config.category.colorScale = scaleOrdinal(
                new InternSet(this.config.category.domain),
                this.config.category.colors
            );
        }
    }

    setLine(): void {
        if (this.config.valueIsDefined === undefined) {
            this.config.valueIsDefined = (d, i) =>
                this.canBeDrawnByPath(this.values.x[i]) && this.canBeDrawnByPath(this.values.y[i]);
        }
        const isDefinedValues = d3map(this.config.data, this.config.valueIsDefined);

        this.line = line()
            .defined((i: any) => isDefinedValues[i] as boolean)
            .curve(this.config.curve)
            .x((i: any) => this.xScale(this.values.x[i]))
            .y((i: any) => this.yScale(this.values.y[i]));
    }

    canBeDrawnByPath(x: any): boolean {
        return !(isNaN(x) || x === null || typeof x === 'boolean');
    }

    drawMarks(transitionDuration: number): void {
        this.drawLines(transitionDuration);
        if (this.config.pointMarker.radius) {
            this.drawPointMarkers(transitionDuration);
        } else if (this.config.showTooltip) {
            this.drawHoverDot();
        }
        if (this.config.labelLines) {
            this.drawLineLabels();
        }
    }

    drawLines(transitionDuration: number): void {
        const t = select(this.chart.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
            SVGSVGElement,
            any,
            any,
            any
        >;

        const data = group(this.values.indicies, (i) => this.values.category[i]);

        select(this.linesRef.nativeElement)
            .selectAll('path')
            .data(data, (d): string => d[0])
            .join(
                (enter) =>
                    enter
                        .append('path')
                        .attr('key', ([z]) => z)
                        .attr('class', 'line')
                        .attr('stroke', ([z]) => this.config.category.colorScale(z))
                        .attr('d', ([, I]) => this.line(I)),
                (update) =>
                    update
                        .attr('stroke', ([z]) => this.config.category.colorScale(z))
                        .call((update) => update.transition(t as any).attr('d', ([, I]) => this.line(I))),
                (exit) => exit.remove()
            );
    }

    drawHoverDot(): void {
        select(this.dotRef.nativeElement)
            .append('circle')
            .attr('class', 'tooltip-dot')
            .attr('r', 4)
            .attr('fill', '#222')
            .attr('display', null);
    }

    drawPointMarkers(transitionDuration: number): void {
        const t = select(this.chart.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
            SVGSVGElement,
            any,
            any,
            any
        >;

        const markersData = this.values.indicies.map((i) => {
            return { key: this.getMarkerKey(i), index: i };
        });

        select(this.markersRef.nativeElement)
            .selectAll('circle')
            .data(markersData, (obj: { key: string; index: number }): string => obj.key)
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .filter(this.config.valueIsDefined)
                        .attr('class', 'marker')
                        .attr('key', (d) => d.key)
                        .style('mix-blend-mode', this.config.mixBlendMode)
                        .attr('cx', (d) => this.xScale(this.values.x[d.index]))
                        .attr('cy', (d) => this.yScale(this.values.y[d.index]))
                        .attr('r', this.config.pointMarker.radius)
                        .attr('fill', (d) => this.config.category.colorScale(this.values.category[d.index])),
                (update) =>
                    update.call((update) =>
                        update
                            .filter(this.config.valueIsDefined)
                            .attr('fill', (d) => this.config.category.colorScale(this.values.category[d.index]))
                            .transition(t as any)
                            .attr('cx', (d) => this.xScale(this.values.x[d.index]))
                            .attr('cy', (d) => this.yScale(this.values.y[d.index]))
                    ),
                (exit) => exit.remove()
            );
    }

    getMarkerKey(i: number): string {
        return `${this.values.category[i]}-${this.values.x[i]}`;
    }

    drawLineLabels(): void {
        // TODO: make more flexible (or its own element? currently this only puts labels on the right side of the chart
        select(this.lineLabelsRef.nativeElement)
            .selectAll('text')
            .data(this.values.indicies.filter((i) => this.values.x[i] === this.config.x.domain[1]))
            .join('text')
            .attr('class', 'line-label')
            .attr('x', (i) => `${this.xScale(this.values.x[i]) + 4}px`)
            .attr('y', (i) => `${this.yScale(this.values.y[i]) - 12}px`)
            .text((i) => this.config.lineLabelsFormat(this.values.category[i]));
    }

    onPointerEnter(): void {
        if (this.config.showTooltip) {
            this.chart.setTooltipPosition();
        }
    }

    onPointerLeave(): void {
        if (this.config.showTooltip) {
            this.resetChartStylesAfterHover();
        }
    }

    onPointerMove(event: PointerEvent): void {
        const [pointerX, pointerY] = this.getPointerValuesArray(event);
        if (this.config.showTooltip && this.pointerIsInChartArea(pointerX, pointerY)) {
            this.determineHoverStyles(pointerX, pointerY);
        }
    }

    getPointerValuesArray(event: PointerEvent): [number, number] {
        return pointer(event);
    }

    pointerIsInChartArea(pointerX: number, pointerY: number): boolean {
        return (
            pointerX > this.ranges.x[0] &&
            pointerX < this.ranges.x[1] &&
            pointerY > this.ranges.y[1] &&
            pointerY < this.ranges.y[0]
        );
    }

    determineHoverStyles(pointerX: number, pointerY: number): void {
        const closestPointIndex = this.getClosestPointIndex(pointerX, pointerY);
        if (
            this.config.tooltipDetectionRadius &&
            this.pointerIsInsideShowTooltipRadius(closestPointIndex, pointerX, pointerY)
        ) {
            this.applyHoverStyles(closestPointIndex);
        } else {
            this.removeHoverStyles();
        }
    }

    getClosestPointIndex(pointerX: number, pointerY: number): number {
        return least(this.values.indicies, (i) =>
            this.getPointerDistanceFromPoint(this.values.x[i], this.values.y[i], pointerX, pointerY)
        );
    }

    applyHoverStyles(closestPointIndex: number): void {
        this.styleLinesForHover(closestPointIndex);
        if (this.config.pointMarker) {
            this.styleMarkersForHover(closestPointIndex);
        } else {
            this.styleHoverDotForHover(closestPointIndex);
        }
        this.setTooltipData(closestPointIndex);
        this.setTooltipOffsetValues(closestPointIndex);
        this.chart.htmlTooltip.display = 'block';
        this.tooltipCurrentlyShown = true;
    }

    removeHoverStyles(): void {
        if (this.tooltipCurrentlyShown) {
            this.resetChartStylesAfterHover();
            this.tooltipCurrentlyShown = false;
        }
    }

    getPointerDistanceFromPoint(pointX: number, pointY: number, pointerX: number, pointerY: number): number {
        return Math.hypot(this.xScale(pointX) - pointerX, this.yScale(pointY) - pointerY);
    }

    pointerIsInsideShowTooltipRadius(closestPointIndex: number, pointerX: number, pointerY: number): boolean {
        const cursorDistanceFromPoint = this.getPointerDistanceFromPoint(
            this.values.x[closestPointIndex],
            this.values.y[closestPointIndex],
            pointerX,
            pointerY
        );
        return cursorDistanceFromPoint < this.config.tooltipDetectionRadius;
    }

    styleLinesForHover(closestPointIndex: number): void {
        this.lines
            .style('stroke', ([categoryValue]) =>
                this.values.category[closestPointIndex] === categoryValue ? null : '#ddd'
            )
            .filter(([categoryValue]) => this.values.category[closestPointIndex] === categoryValue)
            .raise();
    }

    styleMarkersForHover(closestPointIndex: number): void {
        this.markers
            .style('fill', (d: { key: string; index: number }): string => {
                return this.values.category[closestPointIndex] === this.values.category[d.index] ? null : '#ddd';
            })
            .attr('r', (d: { key: string; index: number }): number => {
                return closestPointIndex === d.index
                    ? this.config.pointMarker.radius + 1
                    : this.config.pointMarker.radius;
            })
            .filter(
                (d: { key: string; index: number }): boolean =>
                    this.values.category[closestPointIndex] === this.values.category[d.index]
            )
            .raise();
    }

    styleHoverDotForHover(closestPointIndex: number): void {
        this.hoverDot
            .style('display', null)
            .attr('fill', this.config.category.colorScale(this.values.category[closestPointIndex]))
            .attr('cx', this.xScale(this.values.x[closestPointIndex]))
            .attr('cy', this.yScale(this.values.y[closestPointIndex]));
    }

    resetChartStylesAfterHover(): void {
        this.chart.htmlTooltip.display = 'none';
        this.chart.emitTooltipData(null);
        this.lines.style('mix-blend-mode', this.config.mixBlendMode).style('stroke', null);
        if (this.config.pointMarker) {
            this.markers
                .style('mix-blend-mode', this.config.mixBlendMode)
                .style('fill', null)
                .attr('r', this.config.pointMarker.radius);
        } else {
            this.hoverDot.style('display', 'none');
        }
    }

    setTooltipData(closestPointIndex: number): void {
        const datum = this.config.data.find(
            (d) =>
                this.values.x[closestPointIndex] === this.config.x.valueAccessor(d) &&
                this.values.category[closestPointIndex] === this.config.category.valueAccessor(d)
        );
        const tooltipData: LinesTooltipData = {
            datum,
            x: this.formatValue(this.config.x.valueAccessor(datum), this.config.x.valueFormat),
            y: this.formatValue(this.config.y.valueAccessor(datum), this.config.y.valueFormat),
            category: this.config.category.valueAccessor(datum),
            color: this.config.category.colorScale(this.values.category[closestPointIndex]),
        };
        this.chart.emitTooltipData(tooltipData);
    }

    setTooltipOffsetValues(closestPointIndex): void {
        const yPosition = this.yScale(this.values.y[closestPointIndex]);
        const tooltipSpacing = 16;
        this.chart.htmlTooltip.offset.bottom =
            this.chart.divRef.nativeElement.getBoundingClientRect().height - yPosition + tooltipSpacing;
        this.chart.htmlTooltip.offset.left = this.xScale(this.values.x[closestPointIndex]);
    }

    formatValue(value: any, formatSpecifier: string): string {
        const formatter = value instanceof Date ? timeFormat : format;
        if (formatSpecifier) {
            return formatter(formatSpecifier)(value);
        } else {
            return value.toString();
        }
    }
}
