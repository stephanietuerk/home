import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
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
import { BehaviorSubject, throttleTime } from 'rxjs';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { LineChartOptions } from './line-chart.model';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LineChartComponent implements OnInit, OnChanges {
    changeSize: BehaviorSubject<void> = new BehaviorSubject<void>(null);
    @ViewChild('div', { static: true }) divRef: ElementRef<HTMLElement>;
    @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
    @ViewChild('background', { static: true })
    backgroundRef: ElementRef<SVGRectElement>;
    @ViewChild('xAxis', { static: true }) xAxisRef: ElementRef<SVGGElement>;
    @ViewChild('yAxis', { static: true }) yAxisRef: ElementRef<SVGGElement>;
    @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
    @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
    @ViewChild('lineLabels', { static: true })
    lineLabelsRef: ElementRef<SVGSVGElement>;
    @ViewChild('tooltip', { read: ElementRef }) tooltip: ElementRef;
    @Input() config: LineChartOptions;
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

    @HostListener('window:resize', ['$event.target'])
    public onResize() {
        this.resize();
    }

    constructor(private utilities: UtilitiesService) {}

    private get scaledWidth(): number {
        return this.chartShouldScale() ? this.divRef.nativeElement.offsetWidth : this.config.width;
    }

    private get scaledHeight(): number {
        return this.chartShouldScale() ? this.divRef.nativeElement.offsetWidth / this.aspectRatio : this.config.height;
    }

    ngOnInit(): void {
        this.updateChartFromConfig();
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
        if (this.utilities.objectChangedNotFirstTime(changes, 'config')) {
            this.updateChartFromConfig();
        }
    }

    resize(): void {
        if (this.chartShouldScale()) {
            this.changeSize.next();
        }
    }

    chartShouldScale(): boolean {
        return this.divRef.nativeElement.offsetWidth < this.config.width;
    }

    updateChartFromConfig(): void {
        this.setChartMethodsForConfig();
        this.drawChart(this.config.transitionDuration);
    }

    resizeChart(): void {
        this.setXRange();
        this.setYRange();
        this.setXYScales();
        this.setLine();
        this.setChartAxes();
        this.drawChart(0);
    }

    setChartMethodsForConfig(): void {
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
        this.aspectRatio = this.config.width / this.config.height;
    }

    setValueArrays(): void {
        this.xValues = map(this.config.data, this.config.x.valueAccessor);
        this.yValues = map(this.config.data, this.config.y.valueAccessor);
        this.categoryValues = map(this.config.data, this.config.category.valueAccessor);
    }

    initDomains(): void {
        if (this.config.x.domain === undefined) {
            this.config.x.domain = extent(this.xValues);
        }
        if (this.config.y.domain === undefined) {
            this.config.y.domain = [0, max(this.yValues)];
        }
        if (this.config.category.domain === undefined) {
            this.config.category.domain = this.categoryValues;
        }
    }

    setValueArrayIndicies(): void {
        this.valueArrayIndicies = range(this.xValues.length).filter((i) =>
            new InternSet(this.config.category.domain).has(this.categoryValues[i])
        );
    }

    initAxisProperties(): void {
        if (this.config.y.axis.numTicks === undefined) {
            this.config.y.axis.numTicks = this.config.height / 50;
        }
    }

    initRanges(): void {
        if (this.config.x.range === undefined) {
            this.setXRange();
        }
        if (this.config.y.range === undefined) {
            this.setYRange();
        }
    }

    setXRange(): void {
        this.config.x.range = [this.config.margin.left, this.scaledWidth - this.config.margin.right];
    }

    setYRange(): void {
        this.config.y.range = this.config.y.range = [
            this.scaledHeight - this.config.margin.bottom,
            this.config.margin.top,
        ];
    }

    setXYScales(): void {
        this.xScale = this.config.x.scaleType(this.config.x.domain, this.config.x.range);
        this.yScale = this.config.y.scaleType(this.config.y.domain, this.config.y.range);
    }

    initCategoryScale(): void {
        if (this.config.category.colorScale === undefined) {
            const colors = this.config.category.colors ?? this.colors;
            this.config.category.colorScale = scaleOrdinal(new InternSet(this.config.category.domain), colors);
        }
    }

    setLine(): void {
        if (this.config.valueIsDefined === undefined) {
            this.config.valueIsDefined = (d, i) => !isNaN(this.xValues[i]) && !isNaN(this.yValues[i]);
        }
        const isDefinedValues = map(this.config.data, this.config.valueIsDefined);

        this.line = line()
            .defined((i: any) => isDefinedValues[i] as boolean)
            .curve(this.config.curve)
            .x((i: any) => this.xScale(this.xValues[i]))
            .y((i: any) => this.yScale(this.yValues[i]));
    }

    setChartAxes(): void {
        const xAxisType = this.config.x.axis.side === 'top' ? axisTop : axisBottom;
        const yAxisType = this.config.y.axis.side === 'left' ? axisLeft : axisRight;
        this.xAxis = xAxisType(this.xScale).ticks(this.config.x.axis.numTicks, this.config.x.valueFormat);
        this.yAxis = yAxisType(this.yScale).ticks(this.config.y.axis.numTicks, this.config.y.valueFormat);
    }

    drawChart(transitionDuration: number): void {
        if (this.config.x.axis.show) {
            this.drawXAxis();
        }
        if (this.config.y.axis.show) {
            this.drawYAxis();
        }
        this.drawLines(transitionDuration);
        if (this.config.usePointMarker) {
            this.drawPointMarkers(transitionDuration);
        }
        if (this.config.labelLines) {
            this.drawLineLabels();
        }
    }

    drawXAxis(): void {
        const translateY =
            this.config.x.axis.side === 'top' ? this.config.margin.top : this.scaledHeight - this.config.margin.bottom;

        select(this.xAxisRef.nativeElement).attr('transform', `translate(0,${translateY})`).call(this.xAxis);

        if (this.config.x.axis.removeDomain) {
            this.removeAxisDomain(this.xAxisRef.nativeElement);
        }
    }

    drawYAxis(): void {
        const translateX =
            this.config.y.axis.side === 'left' ? this.config.margin.left : this.scaledWidth - this.config.margin.right;

        select(this.yAxisRef.nativeElement).attr('transform', `translate(${translateX},0)`).call(this.yAxis);

        if (this.config.y.axis.removeDomain) {
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
                        .style('mix-blend-mode', this.config.mixBlendMode)
                        .attr('stroke', ([z]) => this.config.category.colorScale(z))
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
                        .attr('r', this.config.pointMarkerRadius)
                        .attr('fill', (i) => this.config.category.colorScale(this.categoryValues[i])),
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
            .data(this.valueArrayIndicies.filter((i) => this.xValues[i] === this.config.x.domain[1]))
            .join('text')
            .attr('class', 'line-label')
            .attr('x', (i) => `${this.xScale(this.xValues[i]) + 4}px`)
            .attr('y', (i) => `${this.yScale(this.yValues[i]) - 12}px`)
            .text((i) => this.config.lineLabelsFormat(this.categoryValues[i]));
    }

    onTouchStart(event: TouchEvent): void {
        return;
    }
    onPointerMove(event: PointerEvent): void {
        return;
    }
    onPointerLeave(event: PointerEvent): void {
        return;
    }
}
