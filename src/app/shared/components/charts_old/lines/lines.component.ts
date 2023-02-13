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
    map,
    max,
    min,
    pointer,
    range,
    scaleOrdinal,
    select,
    timeFormat,
    Transition,
} from 'd3';
import { combineLatest, takeUntil } from 'rxjs';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { ChartComponent } from '../chart/chart.component';
import { Ranges } from '../chart/chart.model';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { XyDataMarks, XyDataMarksValues } from '../data-marks/xy-data-marks.model';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { LinesConfig, LinesTooltipData, Marker } from './lines.model';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[data-marks-lines]',
    templateUrl: './lines.component.html',
    styleUrls: ['./lines.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: DATA_MARKS, useExisting: LinesComponent }],
})
export class LinesComponent extends Unsubscribe implements XyDataMarks, OnChanges, OnInit {
    @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
    @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
    @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
    @ViewChild('lineLabels', { static: true })
    lineLabelsRef: ElementRef<SVGSVGElement>;
    @Input() config: LinesConfig;
    @Output() tooltipData = new EventEmitter<LinesTooltipData>();
    values: XyDataMarksValues = new XyDataMarksValues();
    ranges: Ranges;
    xScale: (d: any) => any;
    yScale: (d: any) => any;
    line: (x: any[]) => any;
    linesD3Data;
    linesKeyFunction: (d) => string;
    markersD3Data: Marker[];
    markersKeyFunction: (d) => string;
    tooltipCurrentlyShown = false;

    constructor(
        public chart: ChartComponent,
        public xySpace: XyChartSpaceComponent,
        private utilities: UtilitiesService,
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

    get lineLabels(): any {
        return select(this.lineLabelsRef.nativeElement).selectAll('text');
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
        this.setLinesD3Data();
        this.setLinesKeyFunction();
        this.setMarkersD3Data();
        this.setMarkersKeyFunction();
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
        this.values.x = map(this.config.data, this.config.x.valueAccessor);
        this.values.y = map(this.config.data, this.config.y.valueAccessor);
        this.values.category = map(this.config.data, this.config.category.valueAccessor);
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
        this.zone.run(() => {
            this.xySpace.updateXScale(this.config.x.scaleType(this.config.x.domain, this.ranges.x));
            this.xySpace.updateYScale(this.config.y.scaleType(this.config.y.domain, this.ranges.y));
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
        const isDefinedValues = map(this.config.data, this.config.valueIsDefined);

        this.line = line()
            .defined((i: any) => isDefinedValues[i] as boolean)
            .curve(this.config.curve)
            .x((i: any) => this.xScale(this.values.x[i]))
            .y((i: any) => this.yScale(this.values.y[i]));
    }

    canBeDrawnByPath(x: any): boolean {
        return !(isNaN(x) || x === null || typeof x === 'boolean');
    }

    setLinesD3Data(): void {
        this.linesD3Data = group(this.values.indicies, (i) => this.values.category[i]);
    }

    setLinesKeyFunction(): void {
        this.linesKeyFunction = (d): string => d[0];
    }

    setMarkersD3Data(): void {
        this.markersD3Data = this.values.indicies
            .map((i) => {
                return { key: this.getMarkerKey(i), index: i };
            })
            .filter(
                (marker: Marker) =>
                    this.canBeDrawnByPath(this.values.x[marker.index]) &&
                    this.canBeDrawnByPath(this.values.y[marker.index])
            );
    }

    getMarkerKey(i: number): string {
        return `${this.values.category[i]}-${this.values.x[i]}`;
    }

    setMarkersKeyFunction(): void {
        this.markersKeyFunction = (d) => (d as Marker).key;
    }

    drawMarks(transitionDuration: number): void {
        this.drawLines(transitionDuration);
        if (this.config.pointMarker.display) {
            this.drawPointMarkers(transitionDuration);
        } else if (this.config.showTooltip) {
            this.drawHoverDot();
        }
        if (this.config.lineLabels.show) {
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

        this.lines.data(this.linesD3Data, this.linesKeyFunction).join(
            (enter) =>
                enter
                    .append('path')
                    .property('key', ([category]) => category)
                    .attr('class', 'line')
                    .attr('stroke', ([category]) => this.config.category.colorScale(category))
                    .attr('d', ([, lineData]) => this.line(lineData)),
            (update) =>
                update
                    .attr('stroke', ([category]) => this.config.category.colorScale(category))
                    .call((update) => update.transition(t as any).attr('d', ([, lineData]) => this.line(lineData))),
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

        this.markers.data(this.markersD3Data, this.markersKeyFunction).join(
            (enter) =>
                enter
                    .append('circle')
                    .attr('class', 'marker')
                    .attr('key', (d) => d.key)
                    .style('mix-blend-mode', this.config.mixBlendMode)
                    .attr('cx', (d) => this.xScale(this.values.x[d.index]))
                    .attr('cy', (d) => this.yScale(this.values.y[d.index]))
                    .attr('r', this.config.pointMarker.radius)
                    .attr('fill', (d) => this.config.category.colorScale(this.values.category[d.index])),
            (update) =>
                update
                    .attr('fill', (d) => this.config.category.colorScale(this.values.category[d.index]))
                    .call((update) =>
                        update
                            .filter(this.config.valueIsDefined)
                            .transition(t as any)
                            .attr('cx', (d) => this.xScale(this.values.x[d.index]))
                            .attr('cy', (d) => this.yScale(this.values.y[d.index]))
                    ),
            (exit) => exit.remove()
        );
    }

    drawLineLabels(): void {
        const lastPoints = [];
        this.linesD3Data.forEach((values, key) => {
            const lastPoint = values[values.length - 1];
            lastPoints.push({ category: key, index: lastPoint });
        });

        const xOffset = this.config.lineLabels.align === 'outside' ? 4 : -4;
        const textAnchor = this.config.lineLabels.align === 'outside' ? 'start' : 'end';
        // TODO: make more flexible (or its own element? currently this only puts labels on the right side of the chart
        select(this.lineLabelsRef.nativeElement)
            .selectAll('text')
            .data(lastPoints)
            .join('text')
            .attr('class', 'line-label')
            .attr('text-anchor', textAnchor)
            .attr('fill', (d) => this.config.category.colorScale(this.values.category[d.index]))
            .attr('x', (d) => `${this.xScale(this.values.x[d.index]) + xOffset}px`)
            .attr('y', (d) => `${this.yScale(this.values.y[d.index]) - 12}px`)
            .text((d) => this.config.lineLabels.format(d.category));
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
        if (this.pointerIsInsideShowTooltipRadius(closestPointIndex, pointerX, pointerY)) {
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
        if (this.config.pointMarker.display) {
            this.styleMarkersForHover(closestPointIndex);
        } else {
            this.styleHoverDotForHover(closestPointIndex);
        }
        if (this.config.lineLabels.show) {
            this.styleLineLabelsForHover(closestPointIndex);
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
            .style('stroke', ([category]): string =>
                this.values.category[closestPointIndex] === category ? null : '#ddd'
            )
            .filter(([category]): boolean => this.values.category[closestPointIndex] === category)
            .raise();
    }

    styleLineLabelsForHover(closestPointIndex: number): void {
        this.lineLabels
            .style('fill', (lineLabel): string =>
                this.values.category[closestPointIndex] === lineLabel.category ? null : '#ddd'
            )
            .filter((lineLabel): boolean => this.values.category[closestPointIndex] === lineLabel.category)
            .raise();
    }

    styleMarkersForHover(closestPointIndex: number): void {
        this.markers
            .style('fill', (d): string =>
                this.values.category[closestPointIndex] === this.values.category[d.index] ? null : '#ddd'
            )
            .attr('r', (d): number => {
                let r = this.config.pointMarker.radius;
                if (closestPointIndex === d.index) {
                    r = this.config.pointMarker.radius + this.config.pointMarker.growByOnHover;
                }
                return r;
            })
            .filter((d): boolean => this.values.category[closestPointIndex] === this.values.category[d.index])
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
        if (this.config.pointMarker.display) {
            this.markers.style('mix-blend-mode', this.config.mixBlendMode).style('fill', null);
        } else {
            this.hoverDot.style('display', 'none');
        }
        if (this.config.lineLabels.show) {
            this.lineLabels.style('fill', null);
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
