import {
    area,
    ascending,
    axisBottom,
    axisLeft,
    curveLinear,
    extent,
    InternSet,
    map,
    range,
    rollup,
    scaleLinear,
    scaleOrdinal,
    scaleUtc,
    schemeTableau10,
    select,
    stack,
    stackOffsetNone,
    stackOrderNone,
} from 'd3';
import { StackedAreaConfig, StackedAreaOptions } from './stacked-area.model';

export class StackedAreaChart {
    el: HTMLElement;
    data: any[];
    options: StackedAreaOptions;
    svg;
    series;
    area;
    yAxis;
    xAxis;
    xScale;
    yScale;
    colorScale;
    X;
    Y;
    Z;

    constructor(config: StackedAreaConfig) {
        const defaultOptions: StackedAreaOptions = {
            x: ([x]) => x,
            y: ([, y]) => y,
            z: () => 1,
            width: 800,
            height: 600,
            margin: {
                top: 36,
                right: 36,
                bottom: 36,
                left: 36,
            },
            xScaleType: scaleUtc,
            yScaleType: scaleLinear,
            offset: stackOffsetNone,
            order: stackOrderNone,
            colors: schemeTableau10 as string[],
            curve: curveLinear,
        };
        defaultOptions.xRange = [defaultOptions.margin.left, defaultOptions.width - defaultOptions.margin.right];
        defaultOptions.yRange = [defaultOptions.height - defaultOptions.margin.bottom, defaultOptions.margin.top];

        this.el = config.el;
        this.data = config.data;
        this.options = { ...defaultOptions, ...config.options };
        this.setChartMethods();
        this.createSvg();
        this.createChart();
    }

    setChartMethods(): void {
        this.setDataArrays();
        this.setXDomain();
        this.setZDomain();

        const zDomainSet = new InternSet(this.options.zDomain);

        const I: any[] = range(this.X.length).filter((i) => zDomainSet.has(this.Z[i]));

        const rolledUpData: Map<any, Map<any, number>> = rollup(
            I,
            ([i]) => i,
            (i) => this.X[i],
            (i) => this.Z[i]
        );

        this.series = stack()
            .keys(zDomainSet)
            .value(([x, I]: any, z) => this.Y[I.get(z)])
            .order(this.options.order)
            .offset(this.options.offset)(rolledUpData as any)
            .map((s) => s.map((d) => Object.assign(d, { i: (d.data[1] as any).get(s.key) })))
            .sort((a: any, b: any) => ascending(a.i, b.i));

        this.setYDomain(this.series);

        this.setXScale();
        this.setYScale();
        this.setColorScale(zDomainSet);
        this.setChartAxes();

        this.area = area()
            .x(({ i }: any) => this.xScale(this.X[i]))
            .y0(([y1]) => this.yScale(y1))
            .y1(([, y2]) => this.yScale(y2))
            .curve(this.options.curve);
    }

    setDataArrays(): void {
        this.X = map(this.data, this.options.x);
        this.Y = map(this.data, this.options.y);
        this.Z = map(this.data, this.options.z);
    }

    setXDomain(): void {
        if (this.options.xDomain === undefined) {
            this.options.xDomain = extent(this.X);
        }
    }

    setZDomain(): void {
        if (this.options.zDomain === undefined) {
            this.options.zDomain = this.Z;
        }
    }

    setYDomain(series): void {
        if (this.options.yDomain === undefined) {
            this.options.yDomain = extent(series.flat(2));
            this.options.yDomain[0] = Math.floor(this.options.yDomain[0]);
            this.options.yDomain[1] = Math.ceil(this.options.yDomain[1]);
        }
    }

    setXScale(): void {
        this.xScale = this.options.xScaleType(this.options.xDomain, this.options.xRange);
    }

    setYScale(): void {
        this.yScale = this.options.yScaleType(this.options.yDomain, this.options.yRange);
    }

    setColorScale(zDomain): void {
        if (this.options.colorScale === undefined) {
            this.colorScale = scaleOrdinal(zDomain, this.options.colors);
        } else {
            this.colorScale = this.options.colorScale;
        }
    }

    setChartAxes(): void {
        this.xAxis = axisBottom(this.xScale);
        this.yAxis = axisLeft(this.yScale).ticks(this.options.height / 50, this.options.yFormat);
    }

    createSvg(): void {
        this.svg = select(this.el)
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .attr('viewBox', [0, 0, this.options.width, this.options.height])
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
    }

    createChart(): void {
        this.svg
            .append('g')
            .attr('transform', `translate(${this.options.margin.left},0)`)
            .call(this.yAxis)
            .call((g) => g.select('.domain').remove())
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .clone()
                    .attr('x2', this.options.width - this.options.margin.left - this.options.margin.right)
                    .attr('stroke-opacity', 0.1)
            )
            .call((g) =>
                g
                    .append('text')
                    .attr('class', 'stacked-area-y-axis-label')
                    .attr('x', 0)
                    .attr('y', this.options.margin.top - 10 > 0 ? this.options.margin.top - 10 : 10)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'start')
                    .text(this.options.yLabel)
            );

        this.svg
            .append('g')
            .selectAll('path')
            .data(this.series)
            .join('path')
            .attr('fill', ([{ i }]) => {
                console.log(this.Z[i]);
                return this.colorScale(this.Z[i]);
            })
            .attr('d', this.area)
            .append('title')
            .text(([{ i }]) => this.Z[i]);

        this.svg
            .append('g')
            .attr('transform', `translate(0,${this.options.height - this.options.margin.bottom})`)
            .call(this.xAxis);
    }
}
