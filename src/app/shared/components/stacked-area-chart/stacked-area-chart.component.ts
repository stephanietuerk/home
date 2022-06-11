import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
    area,
    axisBottom,
    axisLeft,
    bisectLeft,
    curveLinear,
    extent,
    format,
    InternSet,
    map,
    pointer,
    range,
    rollup,
    scaleLinear,
    scaleOrdinal,
    scaleUtc,
    schemeTableau10,
    select,
    Series,
    stack,
    stackOffsetNone,
    stackOrderNone,
} from 'd3';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { TooltipArea } from './stacked-area-tooltip/stacked-area-tooltip.model';

@Component({
    selector: 'app-stacked-area-chart',
    templateUrl: './stacked-area-chart.component.html',
    styleUrls: ['./stacked-area-chart.component.scss'],
})
export class StackedAreaChartComponent implements OnInit {
    @ViewChild('el', { static: true }) el: ElementRef;
    @ViewChild('tooltip', { read: ElementRef }) tooltip: ElementRef;
    @Input() data: any[];
    @Input() x?: (any) => any = ([x]) => x;
    @Input() y?: (any) => any = ([, y]) => y;
    @Input() z?: (any) => any = () => 1;
    @Input() width?: number = 800;
    @Input() height?: number = 600;
    @Input() margin?: ElementSpacing = {
        top: 36,
        right: 36,
        bottom: 36,
        left: 36,
    };
    @Input() xScaleType?: (d: any, r: any) => any = scaleUtc;
    @Input() xDomain?: [any, any];
    @Input() xRange?: [number, number];
    @Input() yScaleType?: (d: any, r: any) => any = scaleLinear;
    @Input() yDomain?: [any, any];
    @Input() yRange?: [number, number];
    @Input() zDomain?: any;
    @Input() offset?: (series: Series<any, any>, order: Iterable<number>) => void = stackOffsetNone;
    @Input() order?: (x: any) => any = stackOrderNone;
    @Input() curve?: (x: any) => any = curveLinear;
    @Input() keyOrder?: string[];
    @Input() xFormat?: string;
    @Input() yFormat?: string;
    @Input() yLabel?: string;
    @Input() colors?: string[] = schemeTableau10 as string[];
    @Input() colorScale?: (d: any) => any;
    @Input() showTooltip? = false;
    @Input() tooltipFormat?: string = '.0f';
    svg;
    chart;
    series;
    area;
    yAxis;
    xAxis;
    xScale;
    yScale;
    X;
    Y;
    Z;
    I: any[];
    snappedCursorX: number;
    tooltipOffsetFromTop: number;
    tooltipOffsetFromLeft: number;
    tooltipWidth: number = 300;
    tooltipXValue: string;
    tooltipData: TooltipArea[];
    tooltipDisplay: string = 'none';

    constructor() {}

    ngOnInit(): void {
        this.setChartMethods();
        this.svg = select(this.el.nativeElement).select('svg');
        this.chart = this.svg.select('.chart-g');
        this.createChart();
    }

    setChartMethods(): void {
        this.setDataArrays();
        this.setXRange();
        this.setYRange();
        this.setXDomain();
        this.setZDomain();

        const zDomainSet = new InternSet(this.zDomain);

        this.I = range(this.X.length).filter((i) => zDomainSet.has(this.Z[i]));

        const rolledUpData: Map<any, Map<any, number>> = rollup(
            this.I,
            ([i]) => i,
            (i) => this.X[i],
            (i) => this.Z[i]
        );

        const keys = this.keyOrder ? this.keyOrder.slice().reverse() : zDomainSet;

        this.series = stack()
            .keys(keys)
            .value(([x, I]: any, z) => this.Y[I.get(z)])
            .order(this.order)
            .offset(this.offset)(rolledUpData as any)
            .map((s) => s.map((d) => Object.assign(d, { i: (d.data[1] as any).get(s.key) })));

        this.setYDomain(this.series);

        this.setXScale();
        this.setYScale();
        this.setColorScale(zDomainSet);
        this.setChartAxes();

        this.area = area()
            .x(({ i }: any) => this.xScale(this.X[i]))
            .y0(([y1]) => this.yScale(y1))
            .y1(([, y2]) => this.yScale(y2))
            .curve(this.curve);
    }

    setDataArrays(): void {
        this.X = map(this.data, this.x);
        this.Y = map(this.data, this.y);
        this.Z = map(this.data, this.z);
    }

    setXRange(): void {
        if (this.xRange === undefined) {
            this.xRange = [this.margin.left, this.width - this.margin.right];
        }
    }

    setYRange(): void {
        if (this.yRange === undefined) {
            this.yRange = [this.height - this.margin.bottom, this.margin.top];
        }
    }

    setXDomain(): void {
        if (this.xDomain === undefined) {
            this.xDomain = extent(this.X);
        }
    }

    setYDomain(series): void {
        if (this.yDomain === undefined) {
            this.yDomain = extent(series.flat(2));
            this.yDomain[0] = Math.floor(this.yDomain[0]);
            this.yDomain[1] = Math.ceil(this.yDomain[1]);
        }
    }

    setZDomain(): void {
        if (this.zDomain === undefined) {
            this.zDomain = this.Z;
        }
    }

    setXScale(): void {
        this.xScale = this.xScaleType(this.xDomain, this.xRange);
    }

    setYScale(): void {
        this.yScale = this.yScaleType(this.yDomain, this.yRange);
    }

    setColorScale(zDomain): void {
        if (this.colorScale === undefined) {
            this.colorScale = scaleOrdinal(zDomain, this.colors);
        } else {
            this.colorScale = this.colorScale;
        }
    }

    setChartAxes(): void {
        this.xAxis = axisBottom(this.xScale).tickFormat(format(this.xFormat));
        this.yAxis = axisLeft(this.yScale).ticks(this.height / 50, this.yFormat);
    }

    createChart(): void {
        this.chart
            .append('g')
            .attr('transform', `translate(${this.margin.left},0)`)
            .call(this.yAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .clone()
                    .attr('x2', this.width - this.margin.left - this.margin.right)
                    .attr('stroke-opacity', 0.1)
            )
            .call((g) =>
                g
                    .append('text')
                    .attr('class', 'stacked-area-y-axis-label')
                    .attr('x', 0)
                    .attr('y', this.margin.top - 10 > 0 ? this.margin.top - 10 : 10)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'start')
                    .text(this.yLabel)
            );

        this.chart
            .append('g')
            .selectAll('path')
            .data(this.series)
            .join('path')
            .attr('fill', ([{ i }]) => this.colorScale(this.Z[i]))
            .attr('d', this.area)
            .attr('Z', ([{ i }]) => this.Z[i]);

        this.chart
            .append('g')
            .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
            .call(this.xAxis);
    }

    removeChart(): void {
        this.chart.selectAll('*').remove();
    }

    onTouchStart(event: TouchEvent): void {
        if (this.showTooltip) {
            event.preventDefault();
        }
    }

    onPointerLeave(event: Event): void {
        if (this.showTooltip) {
            this.tooltipDisplay = 'none';
        }
    }

    onPointerMove(event: Event): void {
        if (this.showTooltip) {
            this.tooltipDisplay = null;
            const [pointerX, pointerY] = pointer(event);
            if (this.xScale.range()[0] <= pointerX && pointerX <= this.xScale.range()[1]) {
                const cursorXVal = this.xScale.invert(pointerX);
                const i1 = bisectLeft(this.X as number[], cursorXVal);
                const i0 = i1 - 1;
                let i;
                if (cursorXVal instanceof Date) {
                    i =
                        cursorXVal.getTime() - (this.X[i0] as Date).getTime() >
                        (this.X[i1] as Date).getTime() - cursorXVal.getTime()
                            ? i1
                            : i0;
                } else {
                    i = cursorXVal - this.X[i0] > this.X[i1] - cursorXVal ? i1 : i0;
                }
                const snappedXAxisValue = this.X[i];
                this.snappedCursorX = this.xScale(this.X[i]);
                this.tooltipXValue = snappedXAxisValue;
                this.setTooltipData();
                this.setTooltipTopOffset(pointerY);
                this.setTooltipLeftOffset();
            }
        }
    }

    setTooltipData(): void {
        const dataForXVal = this.data.filter((d) => this.x(d) === this.tooltipXValue);
        const sortedData = this.keyOrder.map((z) => dataForXVal.find((d) => this.z(d) === z));
        this.tooltipData = sortedData.map((d) => {
            const obj: TooltipArea = {} as TooltipArea;
            obj.name = this.z(d);
            obj.value = this.y(d);
            obj.color = this.colorScale(this.z(d));
            return obj;
        });
    }

    setTooltipTopOffset(pointerY: number): void {
        this.tooltipOffsetFromTop =
            this.margin.top +
            (this.height - this.margin.bottom - this.margin.top - this.tooltip.nativeElement.offsetHeight) / 2;
    }

    setTooltipLeftOffset(): void {
        const spacer = 24;
        if (this.snappedCursorX <= this.width / 2) {
            this.tooltipOffsetFromLeft = this.snappedCursorX + spacer;
        } else {
            this.tooltipOffsetFromLeft = this.snappedCursorX - this.tooltipWidth - spacer;
        }
    }

    getTTAbsolutePosition(): { top: string; left: string } {
        const bbox = this.el.nativeElement.getBoundingClientRect();
        return { top: `${bbox.y}px`, left: `${bbox.x}px` };
    }
}
