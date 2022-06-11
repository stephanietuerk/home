import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    axisBottom,
    axisLeft,
    axisRight,
    axisTop,
    extent,
    group,
    InternSet,
    line,
    map,
    max,
    range,
    scaleOrdinal,
    schemeTableau10,
    select,
    Transition,
} from 'd3';
import { BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { LineChartOptions } from './line-chart.model';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LineChartComponent implements OnInit {
    changeSize: BehaviorSubject<void> = new BehaviorSubject<void>(null);
    @ViewChild('div', { static: true }) divRef: ElementRef<HTMLElement>;
    @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
    @ViewChild('background', { static: true })
    backgroundRef: ElementRef<SVGRectElement>;
    @ViewChild('xAxis', { static: true }) xAxisRef: ElementRef<SVGGElement>;
    @ViewChild('yAxis', { static: true }) yAxisRef: ElementRef<SVGGElement>;
    @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
    @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
    @ViewChild('lineLabels', { static: true }) lineLabelsRef: ElementRef<SVGSVGElement>;
    @ViewChild('tooltip', { read: ElementRef }) tooltip: ElementRef;
    @Input() data: any[];
    @Input() options: LineChartOptions;
    chart;
    line;
    yAxis;
    xAxis;
    xScale;
    yScale;
    xValues: any[];
    yValues: any[];
    categoryValues: any[];
    valueArrayIndicies: any[];
    colors: string[] = schemeTableau10 as string[];
    aspectRatio: number;
    // snappedCursorX: number;
    // tooltipOffsetFromTop: number;
    // tooltipOffsetFromLeft: number;
    // tooltipWidth: number = 300;
    // tooltipXValue: string;
    // tooltipData: TooltipArea[];
    // tooltipDisplay: string = 'none';

    @HostListener('window:resize', ['$event.target'])
    public onResize() {
        this.resize();
    }

    constructor(private utilities: UtilitiesService) {}

    private get scaledWidth(): number {
        return this.chartShouldScale() ? this.divRef.nativeElement.offsetWidth : this.options.width;
    }

    private get scaledHeight(): number {
        return this.chartShouldScale() ? this.divRef.nativeElement.offsetWidth / this.aspectRatio : this.options.height;
    }

    ngOnInit(): void {
        this.updateChartFromOptions();
        this.changeSize
            .asObservable()
            .pipe(throttleTime(100))
            .subscribe(() => {
                if (this.chartShouldScale()) {
                    this.resizeChart();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.utilities.objectChangedNotFirstTime(changes, 'options')) {
            this.updateChartFromOptions();
        }
    }

    resize(): void {
        if (this.chartShouldScale()) {
            this.changeSize.next();
        }
    }

    chartShouldScale(): boolean {
        return this.divRef.nativeElement.offsetWidth < this.options.width;
    }

    updateChartFromOptions(): void {
        this.setChartMethodsForOptions();
        this.drawChart(this.options.transitionDuration);
    }

    resizeChart(): void {
        this.setXRange();
        this.setYRange();
        this.setXYScales();
        this.setLine();
        this.setChartAxes();
        this.drawChart(0);
    }

    setChartMethodsForOptions(): void {
        this.setAspectRatio();
        this.setValueArrays();
        this.initDomains();
        this.setValueArrayIndicies();
        this.initAxisProperties();
        this.initRanges();
        this.setXYScales();
        this.initCategoryScale();
        this.setLine();
        this.setChartAxes();
    }

    setAspectRatio(): void {
        this.aspectRatio = this.options.width / this.options.height;
    }

    setValueArrays(): void {
        this.xValues = map(this.data, this.options.x.valueAccessor);
        this.yValues = map(this.data, this.options.y.valueAccessor);
        this.categoryValues = map(this.data, this.options.category.valueAccessor);
    }

    initDomains(): void {
        if (this.options.x.domain === undefined) {
            this.options.x.domain = extent(this.xValues);
        }
        if (this.options.y.domain === undefined) {
            this.options.y.domain = [0, max(this.yValues)];
        }
        if (this.options.category.domain === undefined) {
            this.options.category.domain = this.categoryValues;
        }
    }

    setValueArrayIndicies(): void {
        this.valueArrayIndicies = range(this.xValues.length).filter((i) =>
            new InternSet(this.options.category.domain).has(this.categoryValues[i])
        );
    }

    initAxisProperties(): void {
        if (this.options.y.axis.numTicks === undefined) {
            this.options.y.axis.numTicks = this.options.height / 50;
        }
    }

    initRanges(): void {
        if (this.options.x.range === undefined) {
            this.setXRange();
        }
        if (this.options.y.range === undefined) {
            this.setYRange();
        }
    }

    setXRange(): void {
        this.options.x.range = [this.options.margin.left, this.scaledWidth - this.options.margin.right];
    }

    setYRange(): void {
        this.options.y.range = this.options.y.range = [
            this.scaledHeight - this.options.margin.bottom,
            this.options.margin.top,
        ];
    }

    setXYScales(): void {
        this.xScale = this.options.x.scaleType(this.options.x.domain, this.options.x.range);
        this.yScale = this.options.y.scaleType(this.options.y.domain, this.options.y.range);
    }

    initCategoryScale(): void {
        if (this.options.category.colorScale === undefined) {
            const colors = this.options.category.colors ?? this.colors;
            this.options.category.colorScale = scaleOrdinal(new InternSet(this.options.category.domain), colors);
        }
    }

    setLine(): void {
        if (this.options.valueIsDefined === undefined) {
            this.options.valueIsDefined = (d, i) => !isNaN(this.xValues[i]) && !isNaN(this.yValues[i]);
        }
        const isDefinedValues = map(this.data, this.options.valueIsDefined);

        this.line = line()
            .defined((i: any) => isDefinedValues[i] as boolean)
            .curve(this.options.curve)
            .x((i: any) => this.xScale(this.xValues[i]))
            .y((i: any) => this.yScale(this.yValues[i]));
    }

    setChartAxes(): void {
        const xAxisType = this.options.x.axis.side === 'top' ? axisTop : axisBottom;
        const yAxisType = this.options.y.axis.side === 'left' ? axisLeft : axisRight;
        this.xAxis = xAxisType(this.xScale).ticks(this.options.x.axis.numTicks, this.options.x.valueFormat);
        this.yAxis = yAxisType(this.yScale).ticks(this.options.y.axis.numTicks, this.options.y.valueFormat);
    }

    drawChart(transitionDuration: number): void {
        if (this.options.x.axis.show) {
            this.drawXAxis();
        }
        if (this.options.y.axis.show) {
            this.drawYAxis();
        }
        this.drawLines(transitionDuration);
        if (this.options.usePointMarker) {
            this.drawPointMarkers(transitionDuration);
        }
        if (this.options.labelLines) {
            this.drawLineLabels();
        }
    }

    drawXAxis(): void {
        const translateY =
            this.options.x.axis.side === 'top'
                ? this.options.margin.top
                : this.scaledHeight - this.options.margin.bottom;

        select(this.xAxisRef.nativeElement).attr('transform', `translate(0,${translateY})`).call(this.xAxis);

        if (this.options.x.axis.removeDomain) {
            this.removeAxisDomain(this.xAxisRef.nativeElement);
        }
    }

    drawYAxis(): void {
        const translateX =
            this.options.y.axis.side === 'left'
                ? this.options.margin.left
                : this.scaledWidth - this.options.margin.right;

        select(this.yAxisRef.nativeElement).attr('transform', `translate(${translateX},0)`).call(this.yAxis);

        if (this.options.y.axis.removeDomain) {
            this.removeAxisDomain(this.yAxisRef.nativeElement);
        }
    }

    removeAxisDomain(axisG: SVGGElement): void {
        select(axisG).call((g) => g.select('.domain').remove());
    }

    drawLines(transitionDuration: number): void {
        const t = select(this.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
            SVGSVGElement,
            any,
            any,
            any
        >;
        select(this.linesRef.nativeElement)
            .selectAll('path')
            .data(group(this.valueArrayIndicies, (i) => this.categoryValues[i]))
            .join(
                (enter) =>
                    enter
                        .append('path')
                        .style('mix-blend-mode', this.options.mixBlendMode)
                        .attr('stroke', ([z]) => this.options.category.colorScale(z))
                        .attr('d', ([, I]) => this.line(I)),
                (update) => update.call((update) => update.transition(t as any).attr('d', ([, I]) => this.line(I))),
                (exit) => exit.remove()
            );
    }

    drawPointMarkers(transitionDuration: number): void {
        const t = select(this.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
            SVGSVGElement,
            any,
            any,
            any
        >;
        select(this.markersRef.nativeElement)
            .selectAll('circle')
            .data(this.valueArrayIndicies)
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .attr('cx', (i) => this.xScale(this.xValues[i]))
                        .attr('cy', (i) => this.yScale(this.yValues[i]))
                        .attr('r', this.options.pointMarkerRadius)
                        .attr('fill', (i) => this.options.category.colorScale(this.categoryValues[i])),
                (update) =>
                    update.call((update) =>
                        update
                            .transition(t as any)
                            .attr('cx', (i) => this.xScale(this.xValues[i]))
                            .attr('cy', (i) => this.yScale(this.yValues[i]))
                    ),
                (exit) => exit.remove()
            );
    }

    drawLineLabels(): void {
        select(this.lineLabelsRef.nativeElement)
            .selectAll('text')
            .data(this.valueArrayIndicies.filter((i) => this.xValues[i] === this.options.x.domain[1]))
            .join('text')
            .attr('class', 'line-label')
            .attr('x', (i) => `${this.xScale(this.xValues[i]) + 4}px`)
            .attr('y', (i) => `${this.yScale(this.yValues[i]) - 12}px`)
            .text((i) => this.options.lineLabelsFormat(this.categoryValues[i]));
    }

    getOverlayDivAbsolutePosition(): { top: string; left: string } {
        const bbox = this.divRef.nativeElement.getBoundingClientRect();
        return { top: `${bbox.y}px`, left: `${bbox.x}px` };
    }

    onTouchStart(event: TouchEvent): void {}
    onPointerMove(event: PointerEvent): void {}
    onPointerLeave(event: PointerEvent): void {}
}
