import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
    axisBottom,
    axisLeft,
    axisTop,
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
import { BEYOND_COLORS, BEYOND_SCALES } from '../beyond.constants';
import { TractDatum } from '../models/beyond-data.model';
import { DemoTime, DemoVariable, ElectionYear } from '../models/beyond-enums.model';
import { BeyondService } from '../services/beyond.service';

@Component({
    selector: 'app-beyond-bar',
    templateUrl: './beyond-bar.component.html',
    styleUrls: ['./beyond-bar.component.scss'],
})
export class BeyondBarComponent implements OnInit, OnChanges {
    @Input() electionYear: string;
    @Input() electionType: string;
    @Input() demoType: string;
    @Input() demoYear: string;
    data: { string: TractDatum }[];
    barCreated: boolean = false;
    divId: string = '#beyond-bar';
    svg: any;
    barMain: any;
    barIndex: any;
    visWidth = 920;
    visHeight: number;
    barMainWidth = 870;
    barMainMargin = {
        top: 40,
        right: 10,
        bottom: 20,
        left: 66,
    };
    barIndexWidth = 30;
    barIndexMargin = {
        top: 40,
        right: 10,
        bottom: 20,
        left: 10,
    };
    numQuantiles = 10;
    y: any;
    x: any;

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
        this.setVisHeight();
        this.makeYScale();
        this.makeXScale();
        this.makeSvg();
        this.makeBarMain();
        this.makeBarIndex();
        this.setAxes();
        this.barCreated = true;
    }

    updateVis(): void {
        this.sortData();
        this.setVisHeight();
        this.makeYScale();
        this.makeXScale();
        this.updateAxes();

        const duration = 300;
        const t = transition().duration(duration).ease(easeQuadOut);

        this.updateBarMain(t);
        this.updateBarIndex(t);
    }

    updateAxes(): void {
        select('#demoXAxisTop').remove();
        select('#demoXAxisBottom').remove();
        select('#demoYAxis').remove();
        select('#demoZeroAxis').remove();
        selectAll('.chart-label').remove();
        selectAll('.chart-yaxis-label').remove();

        this.setAxes();
    }

    updateBarMain(t) {
        const barWidth = this.getBarWidthFunc();
        const barX = this.getBarXFunc();
        const selector = '.bar.main';
        this.updateBar(barWidth, barX, selector, t);
    }

    updateBarIndex(t) {
        const barWidth = (d) => this.barIndexWidth;
        const barX = (d) => 0;
        const selector = '.bar.index';
        this.updateBar(barWidth, barX, selector, t);
    }

    updateBar(barWidth, barX, selector, t) {
        this.svg
            .selectAll(selector)
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

    setVisHeight(): void {
        this.visHeight = this.data.length;
    }

    makeYScale(): void {
        const sortedTracts = this.data.map((x) => Object.keys(x)[0]);
        this.y = scaleBand().domain(sortedTracts).rangeRound([0, this.visHeight]);
    }

    makeXScale(): void {
        const domainValues = extent(this.data.map((x) => this.getDemoValue(x)));
        this.x = scaleLinear()
            .domain(domainValues)
            .nice()
            .range([0, this.barMainWidth - this.barMainMargin.left - this.barMainMargin.right]);
    }

    makeSvg(): void {
        this.svg = select(this.divId)
            .append('svg')
            .attr('width', this.visWidth)
            .attr('height', this.visHeight)
            .append('g')
            .attr('class', 'beyond-g')
            .attr('transform', `translate(0, ${this.barMainMargin.top})`);
    }

    makeBarMain(): void {
        this.barMain = this.svg
            .append('g')
            .attr('transform', `translate(${this.barMainMargin.left}, 0)`)
            .attr('id', 'beyond-bar-main-g');

        const barWidth = this.getBarWidthFunc();
        const barX = this.getBarXFunc();
        this.makeBar(this.barMain, barWidth, barX, 'bar main');
        this.getQuantileValues();
    }

    getBarXFunc() {
        return (d) => this.x(Math.min(0, this.getDemoValue(d)));
    }

    getBarWidthFunc() {
        return (d) => Math.abs(this.x(this.getDemoValue(d)) - this.x(0));
    }

    makeBarIndex(): void {
        this.barIndex = this.svg
            .append('g')
            .attr('transform', `translate(${this.barMainWidth + this.barIndexMargin.left}, 0)`)
            .attr('id', 'beyond-bar-index-g');

        const barWidth = (d) => this.barIndexWidth;
        const barX = (d) => 0;
        this.makeBar(this.barIndex, barWidth, barX, 'bar index');
    }

    makeBar(g: any, barWidth: any, barX: any, className: string): void {
        g.selectAll('rect')
            .data(this.data)
            .join('rect')
            .attr('class', className)
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

    getQuantileValues(): void {
        const quantiles = range(this.numQuantiles).map((x) => x / this.numQuantiles);
        const values = this.data.map((x) => this.getDemoValue(x)).filter((x) => x !== null && !isNaN(x));
        return quantiles.map((q) => quantileSorted(values, q));
    }

    setAxes(): void {
        const quantileValues = this.getQuantileValues();
        const tickFormat = this.getAxisTickFormat();

        const barsYQuantiles = scalePoint().domain(quantileValues).range([0, this.visHeight]);

        const barsXAxisTop = axisTop().scale(this.x).tickFormat(tickFormat);
        const barsXAxisBottom = axisBottom().scale(this.x).tickFormat(tickFormat);

        const barsZeroAxis = axisLeft().scale(this.y).tickSize(0).tickFormat('');

        const barsYAxis = axisLeft().scale(barsYQuantiles).tickFormat(tickFormat);

        this.barMain
            .append('g')
            .attr('class', 'x axis')
            .attr('id', 'demoXAxisTop')
            .attr('transform', 'translate(0,' + -10 + ')')
            .call(barsXAxisTop);

        //bottom X Axis (duplicates top X Axis)
        this.barMain
            .append('g')
            .attr('class', 'x axis')
            .attr('id', 'demoXAxisBottom')
            .attr('transform', 'translate(0,' + (this.visHeight + 10) + ')')
            .call(barsXAxisBottom);

        //static left-aligned Y axis to show quantiles
        this.barMain
            .append('g')
            .attr('class', 'y axis')
            .attr('id', 'demoYAxis')
            .attr('transform', 'translate(' + -10 + ',0)')
            .call(barsYAxis);

        //dynamic Y axis that shifts with data
        this.barMain
            .append('g')
            .attr('class', 'zero axis')
            .attr('id', 'demoZeroAxis')
            .attr('transform', 'translate(' + this.x(0) + ',0)')
            .call(barsZeroAxis);

        this.barMain.selectAll('.domain').attr('stroke', 'black').attr('stroke-width', '1');
        this.barMain.selectAll('.y.axis text').style('font-size', '0.8rem');
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
