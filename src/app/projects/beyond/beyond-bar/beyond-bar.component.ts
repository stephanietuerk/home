import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import {
    axisBottom,
    axisLeft,
    axisTop,
    brushY,
    descending,
    extent,
    format,
    scaleBand,
    scaleLinear,
    scalePoint,
    transition,
} from 'd3';
import { quantileSorted, range } from 'd3-array';
import { easeQuadOut } from 'd3-ease';
import { select, selectAll } from 'd3-selection';
import { wrap } from 'src/app/core/utilities/svg-text.utils';
import { BEYOND_COLORS, BEYOND_DEMOTYPES, BEYOND_SCALES } from '../beyond.constants';
import { TractDatum } from '../models/beyond-data.model';
import { DemoTime, DemoVariable, ElectionYear } from '../models/beyond-enums.model';
import { BeyondService } from '../services/beyond.service';

@Component({
    selector: 'app-beyond-bar',
    templateUrl: './beyond-bar.component.html',
    styleUrls: ['./beyond-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BeyondBarComponent implements OnInit, OnChanges {
    @Input() electionYear: string;
    @Input() electionType: string;
    @Input() demoType: string;
    @Input() demoYear: string;
    data: { string: TractDatum }[];
    barCreated: boolean = false;
    divId: string = '#beyond-bar';
    svgMain: any;
    svgIndex: any;
    barMain: any;
    barIndex: any;
    visWidth = 920;
    height: number;
    width = {
        main: 790,
        index: 30,
    };
    margin = {
        top: 60,
        bottom: 40,
        main: {
            right: 20,
            left: 74,
        },
        index: {
            right: 10,
            left: 10,
        },
    };
    axisOffset = 10;
    numQuantiles = 10;
    y: any;
    x: any;
    gridY: any;

    constructor(private beyondService: BeyondService) {}

    ngOnInit(): void {
        this.makeVis();
    }

    ngOnChanges(): void {
        if (this.barCreated) {
            this.updateVis();
        }
    }

    makeVis(): void {
        this.setData();
        this.sortData();
        this.setHeight();
        this.makeYScale();
        this.makeXScale();
        this.makeBarMain();
        this.makeBarIndex();
        this.barCreated = true;
    }

    updateVis(): void {
        this.sortData();
        this.setHeight();
        this.makeYScale();
        this.makeXScale();
        this.updateAxes();

        const duration = 300;
        const t = transition().duration(duration).ease(easeQuadOut);

        this.updateBarMain(t);
        this.updateBarIndex(t);
    }

    updateAxes(): void {
        select('#gridVertical').remove();
        select('#gridHorizontal').remove();
        select('#xAxisTop').remove();
        select('#xAxisBottom').remove();
        select('#yAxis').remove();
        select('#zeroAxis').remove();
        selectAll('.chart-label').remove();
        selectAll('.chart-yaxis-label').remove();

        this.setAxes();
        select('#gridVertical').lower();
        select('#gridHorizontal').lower();
    }

    updateBarMain(t) {
        const barWidth = this.getBarWidthFunc();
        const barX = this.getBarXFunc();
        const selection = this.svgMain.selectAll('.bar.main');
        this.updateBar(barWidth, barX, selection, t);
    }

    updateBarIndex(t) {
        const barWidth = (d) => this.width.index;
        const barX = (d) => 0;
        const selection = this.svgIndex.selectAll('.bar.index');
        this.updateBar(barWidth, barX, selection, t);
    }

    updateBar(barWidth, barX, selection, t) {
        selection
            .transition(t)
            .attr('y', (d) => this.y(Object.keys(d)[0]))
            .attr('x', (d) => barX(d))
            .attr('height', (d) => {
                if (!this.getDemoValue(d)) {
                    return 0;
                } else {
                    return 1;
                }
            })
            .attr('width', (d) => barWidth(d))
            .attr('fill', (d) => this.getVoteColor(d));
    }

    setData() {
        this.data = Object.entries(this.beyondService.tractData).map(([k, v]: [string, TractDatum]) => {
            const obj = {} as { string: TractDatum };
            obj[k] = v;
            return obj;
        });
    }

    sortData(): void {
        this.data.sort((a, b) => {
            if (!this.getDemoValue(a) && !this.getDemoValue(b)) {
                return 0;
            } else if (!this.getDemoValue(a)) {
                return 1;
            } else if (!this.getDemoValue(b)) {
                return -1;
            } else {
                return descending(this.getDemoValue(a), this.getDemoValue(b));
            }
        });
    }

    setHeight(): void {
        this.height = this.data.length;
    }

    makeYScale(): void {
        const sortedTracts = this.data.map((x) => Object.keys(x)[0]);
        this.y = scaleBand().domain(sortedTracts).rangeRound([0, this.height]);
        this.gridY = scaleLinear().domain([0, this.height]).range([0, this.height]);
    }

    makeXScale(): void {
        const domainValues = extent(this.data.map((x) => this.getDemoValue(x)));
        this.x = scaleLinear().domain(domainValues).nice().range([0, this.width.main]);
    }

    makeBarMain(): void {
        this.svgMain = select(this.divId)
            .append('svg')
            .attr('width', this.width.main + this.margin.main.left + this.margin.main.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'beyond-bar-svg-main')
            .append('g')
            .attr('class', 'beyond-bar-main-g')
            .attr('transform', `translate(0, ${this.margin.top})`);

        this.barMain = this.svgMain
            .append('g')
            .attr('transform', `translate(${this.margin.main.left}, 0)`)
            .attr('id', 'beyond-bar-main-g');

        const barWidth = this.getBarWidthFunc();
        const barX = this.getBarXFunc();
        this.setAxes();
        this.makeBar(this.barMain, barWidth, barX, 'bar main');
    }

    makeAxisLabels(): void {
        const labels = BEYOND_DEMOTYPES.find((x) => x.value === this.demoType);
        const yLabel = `${labels.yAxis} decile values`;
        const xLabel = labels.xAxis;
        this.barMain
            .append('text')
            .attr('class', 'bar-main y-axis-label chart-label')
            .text(yLabel)
            .attr('x', -10)
            .attr('y', -10)
            .style('text-anchor', 'end')
            .call(wrap, { width: this.margin.main.left - this.axisOffset, wrapUp: true });

        this.barMain
            .append('text')
            .attr('class', 'bar-main x-axis-label chart-label')
            .text(xLabel)
            .attr('x', this.width.main)
            .attr('y', -36)
            .style('text-anchor', 'end');
    }

    getBarXFunc(): any {
        return (d) => this.x(Math.min(0, this.getDemoValue(d)));
    }

    getBarWidthFunc(): any {
        return (d) => {
            if (this.getDemoValue(d)) {
                return Math.abs(this.x(this.getDemoValue(d)) - this.x(0));
            } else {
                return 0;
            }
        };
    }

    makeBarIndex(): void {
        this.svgIndex = select(this.divId)
            .append('svg')
            .attr('width', this.width.index + this.margin.index.left + this.margin.index.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'beyond-bar-svg-index')
            .append('g')
            .attr('class', 'beyond-bar-index-g')
            .attr('transform', `translate(0, ${this.margin.top})`);

        this.barIndex = this.svgIndex
            .append('g')
            .attr('transform', `translate(${this.margin.index.left}, 0)`)
            .attr('id', 'beyond-bar-index-g');

        this.barIndex
            .append('text')
            .attr('class', 'bar-index drag-instructions')
            .text('drag to select tracts in map')
            .attr('x', this.width.index / 2)
            .attr('y', -10)
            .style('text-anchor', 'middle')
            .call(wrap, { width: this.width.index + this.margin.index.left + this.margin.index.right, wrapUp: true });

        const barWidth = (d) => this.width.index;
        const barX = (d) => 0;
        this.makeBar(this.barIndex, barWidth, barX, 'bar index');
        this.makeBrush();
    }

    makeBrush(): void {
        const brush = brushY()
            .extent([
                [0, 0],
                [this.width.index + this.margin.index.left + this.margin.index.right, this.height],
            ])
            .on('brush', (event) => {
                this.brushTracts(event);
            });

        this.svgIndex.append('g').attr('class', 'brush').call(brush);
        this.svgIndex.selectAll('.overlay').on('mousedown touchstart', this.handleIndexBarClick.bind(this));
    }

    brushTracts(event) {
        if (event.selection) {
            const coords = event.selection;
            const brushed = this.barIndex
                .selectAll('rect')
                .filter((d, i, nodes) => {
                    const y = select(nodes[i]).attr('y');
                    return this.isBrushed(coords, y);
                })
                .classed('brushed', true);

            const tracts = selectAll('.vote-tracts');

            brushed.each((d, i, nodes) => {
                const barTract = nodes[i].getAttribute('tract');
                tracts
                    .filter((tractD) => tractD.properties.GEO_ID === barTract)
                    .raise()
                    .classed('brushed', true)
                    .style('stroke', 'black')
                    .style('stroke-width', '1.5px');
            });
        }
    }

    handleIndexBarClick(): void {
        const tracts = selectAll('.vote-tracts.brushed');

        tracts
            .classed('brushed', false)
            .style('stroke', (d) => this.getVoteColorFromTractGeo(d))
            .style('stroke-width', '0.8px');
    }

    getVoteColorFromTractGeo(x): string {
        const tractNum = x.properties.GEO_ID;
        const tractDataObj = this.data.find((x) => Object.keys(x)[0] === tractNum);
        return this.getVoteColor(tractDataObj);
    }

    isBrushed(coords, y) {
        return coords[0] <= y && y <= coords[1];
    }

    makeBar(g: any, barWidth: any, barX: any, className: string): void {
        g.append('g')
            .attr('class', 'bar-rect-g')
            .selectAll('rect')
            .data(this.data)
            .join('rect')
            .attr('class', className)
            .attr('tract', (d) => Object.keys(d)[0])
            .attr('y', (d) => this.y(Object.keys(d)[0]))
            .attr('x', (d) => barX(d))
            .attr('height', (d) => {
                if (!this.getDemoValue(d)) {
                    return 0;
                } else {
                    return 1;
                }
            })
            .attr('width', (d) => (barWidth(d) ? barWidth(d) : 0))
            .attr('fill', (d) => this.getVoteColor(d));
    }

    getDemoValue(x: { string: TractDatum }): number {
        return Object.values(x)[0][this.demoType][this.demoYear];
    }

    getElectionValue(x: { string: TractDatum }): number {
        return Object.values(x)[0][this.electionType][this.electionYear];
    }

    getVoteColor(x: { string: TractDatum }): string {
        const value = this.getElectionValue(x);
        if (value === 0) {
            return BEYOND_COLORS.initialColor;
        } else {
            const scaleType = this.electionYear === ElectionYear.change ? 'change' : 'vote';
            const partyType = value < 0 ? 'd' : 'r';
            return BEYOND_SCALES[scaleType][partyType](value);
        }
    }

    getQuantileValues(multiplier: number): void {
        const quantiles = range(this.numQuantiles * multiplier).map((x) => x / (this.numQuantiles * multiplier));
        const values = this.data.map((x) => this.getDemoValue(x)).filter((x) => x !== null && !isNaN(x));
        return quantiles.map((q) => quantileSorted(values, q));
    }

    setAxes(): void {
        const quantileValues = this.getQuantileValues(1);
        const horizontalGridValues = this.getQuantileValues(5.5);

        const tickFormat = this.getAxisTickFormat();

        const barsYQuantiles = scalePoint().domain(quantileValues).range([0, this.height]);
        const barsYQuantilesTicks = scalePoint().domain(horizontalGridValues).range([0, this.height]);

        const barsXAxisTop = axisTop().scale(this.x).tickFormat(tickFormat);
        const barsXAxisBottom = axisBottom().scale(this.x).tickFormat(tickFormat);

        const barsZeroAxis = axisLeft().scale(this.y).tickSize(0).tickFormat('');

        const barsYAxis = axisLeft().scale(barsYQuantiles).tickFormat(tickFormat);

        const gridVerticalLines = axisTop().scale(this.x).tickSize(this.height, 0, 0).tickFormat('');

        const gridHorizontalLines = axisLeft()
            .scale(barsYQuantilesTicks)
            .tickSize(-this.x.range()[1], 0, 0)
            .tickFormat('');

        this.barMain
            .append('g')
            .attr('class', 'grid vertical')
            .attr('id', 'gridVertical')
            .attr('transform', 'translate(0,' + (this.height + 0) + ')')
            .call(gridVerticalLines)
            .call((g) => g.select('.domain').remove())
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .attr('stroke', 'black')
                    .attr('stroke-opacity', 0.4)
                    .attr('stroke-dasharray', '2 4')
            );

        this.barMain
            .append('g')
            .attr('class', 'grid horizontal')
            .attr('id', 'gridHorizontal')
            .call(gridHorizontalLines)
            .call((g) => g.select('.domain').remove())
            .call((g) =>
                g
                    .selectAll('.tick line')
                    .attr('stroke', 'black')
                    .attr('stroke-opacity', 0.5)
                    .attr('stroke-dasharray', '2,2')
            );

        this.barMain
            .append('g')
            .attr('class', 'x axis')
            .attr('id', 'xAxisTop')
            .attr('transform', `translate(0, -${this.axisOffset})`)
            .call(barsXAxisTop);

        //bottom X Axis (duplicates top X Axis)
        this.barMain
            .append('g')
            .attr('class', 'x axis')
            .attr('id', 'xAxisBottom')
            .attr('transform', 'translate(0,' + (this.height + this.axisOffset) + ')')
            .call(barsXAxisBottom);

        //static left-aligned Y axis to show quantiles
        this.barMain
            .append('g')
            .attr('class', 'y axis')
            .attr('id', 'yAxis')
            .attr('transform', `translate(-${this.axisOffset}, 0)`)
            .call(barsYAxis);

        //dynamic Y axis that shifts with data
        this.barMain
            .append('g')
            .attr('class', 'zero axis')
            .attr('id', 'zeroAxis')
            .attr('transform', 'translate(' + this.x(0) + ',0)')
            .call(barsZeroAxis);

        this.barMain.selectAll('.domain').attr('stroke', 'black').attr('stroke-width', '1');
        this.barMain.selectAll('.y.axis text').style('font-size', '0.8rem');
        this.makeAxisLabels();
    }

    getAxisTickFormat() {
        if (this.demoYear == DemoTime.change) {
            return format('.0%');
        } else {
            if (this.demoType == DemoVariable.populationDensity) {
                return format(',.0f');
            } else if (this.demoType == DemoVariable.income) {
                return format('$,.0f');
            } else {
                return function (d) {
                    return d + '%';
                };
            }
        }
    }
}
