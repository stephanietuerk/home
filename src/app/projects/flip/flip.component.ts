import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { easeQuadOut, format } from 'd3';
import { range } from 'd3-array';
import { geoAlbers, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { interpolateNumber } from 'src/app/core/utilities/number.utils';
import * as topojson from 'topojson-client';
import { FlipBar } from './flip-bar.class';
import { FLIPBARLAYOUT, FLIPCOLORS } from './flip.constants';
import { Party } from './flip.model';
import { FlipService } from './flip.service';

@Component({
  selector: 'app-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FlipComponent implements OnInit {
  @ViewChild('intro', { static: true }) introElRef: ElementRef;
  @ViewChild('main', { static: true }) mainElRef: ElementRef;
  divId = '#flip-the-district';
  introId = '#flip-intro';

  constructor(private flipService: FlipService) {}

  ngOnInit() {
    this.flipService.setFlipData();
  }

  initVis() {
    this.makeVis();
    this.mainElRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  makeVis() {
    const container = select(this.divId);
    container.selectAll('div').remove();
    container.selectAll('svg').remove();

    this.makeVoteDisplay(container);
    this.makeBars(container);
    this.makeLowerVis(container);

    container
      .append('div')
      .attr('class', 'reset-button')
      .attr('width', 180)
      .attr('height', 26)
      .text('reset to 2016 results')
      .on('click', this.resetVis.bind(this));
  }

  makeVoteDisplay(svg) {
    const width = 900;
    const height = 150;
    const formatter = format(',.0f');

    const displaySvg = svg
      .append('svg')
      .attr('class', 'container')
      .attr('width', width)
      .attr('height', height)
      .append('g');

    displaySvg
      .append('line')
      .attr('class', 'bars-line')
      .attr('x1', 110)
      .attr('x2', 790)
      .attr('y1', 83)
      .attr('y2', 83)
      .style('stroke', '#cccccc')
      .style('stroke-width', '2px')
      .style('stroke-linecap', 'butt');

    displaySvg
      .append('text')
      .attr('class', 'display-static')
      .attr('x', width / 2)
      .attr('y', height / 2 - 20)
      .style('text-anchor', 'middle')
      .text('votes');

    displaySvg
      .append('text')
      .attr('class', 'display-static')
      .attr('x', width / 2)
      .attr('y', height / 2 + 40 + 10)
      .style('text-anchor', 'middle')
      .text('seats');

    const demVotesDisplay = displaySvg.append('g');

    demVotesDisplay
      .append('text')
      .attr('class', 'display-data-dem display-votes')
      .attr('id', 'dVotesDisplay')
      .attr('width', 300)
      .attr('x', width / 4)
      .attr('y', height / 2 - 15)
      .style('text-anchor', 'middle')
      .style('fill', FLIPCOLORS.dColor)
      .style('stroke', 'none')
      .text('0');

    demVotesDisplay
      .select('text')
      .transition()
      .ease(easeQuadOut)
      .duration(2500)
      .tween('text', (d, i, nodes) => {
        const sel = select(nodes[i]);
        const interpolator = interpolateNumber(
          sel.text(),
          this.flipService.stateData.dVotes
        );
        return (t) => sel.text(formatter(interpolator(t)));
      });

    const repVotesDisplay = displaySvg.append('g');

    repVotesDisplay
      .append('text')
      .attr('class', 'display-data-rep display-votes')
      .attr('id', 'rVotesDisplay')
      .attr('width', 300)
      .attr('x', width * (3 / 4))
      .attr('y', height / 2 - 15)
      .style('text-anchor', 'middle')
      .style('fill', FLIPCOLORS.rColor)
      .style('stroke', 'none')
      .text('0');

    repVotesDisplay
      .select('text')
      .transition()
      .ease(easeQuadOut)
      .duration(2500)
      .tween('text', (d, i, nodes) => {
        const sel = select(nodes[i]);
        const interpolator = interpolateNumber(
          sel.text(),
          this.flipService.stateData.rVotes
        );
        return (t) => sel.text(formatter(interpolator(t)));
      });

    const demDistrictsDisplay = displaySvg.append('g');

    demDistrictsDisplay
      .append('text')
      .attr('class', 'display-data-dem display-districts')
      .attr('id', 'dDistrictsDisplay')
      .attr('x', width * (1 / 4))
      .attr('y', height / 2 + 40 + 10)
      .style('text-anchor', 'middle')
      .style('fill', FLIPCOLORS.dColor)
      .text('');

    demDistrictsDisplay
      .select('text')
      .transition()
      //.ease('poly-out')
      .duration(2500)
      .tween('text', (d, i, nodes) => {
        const sel = select(nodes[i]);
        const interpolator = interpolateNumber(
          sel.text(),
          this.flipService.stateData.dDistricts
        );
        return (t) => sel.text(formatter(interpolator(t)));
      });

    const repDistrictsDisplay = displaySvg.append('g');

    repDistrictsDisplay
      .append('text')
      .attr('class', 'display-data-rep display-districts')
      .attr('id', 'rDistrictsDisplay')
      .attr('x', width * (3 / 4))
      .attr('y', height / 2 + 40 + 10)
      .style('text-anchor', 'middle')
      .style('fill', FLIPCOLORS.rColor)
      .text('');

    repDistrictsDisplay
      .select('text')
      .transition()
      //.ease('poly-out')
      .duration(2500)
      .tween('text', (d, i, nodes) => {
        const sel = select(nodes[i]);
        const interpolator = interpolateNumber(
          sel.text(),
          this.flipService.stateData.rDistricts
        );
        return (t) => sel.text(formatter(interpolator(t)));
      });
  }

  makeBars(svg) {
    const numBars = Object.keys(this.flipService.districtsData).length;

    const barMargin = { top: 0, right: 11, bottom: 0, left: 11 };
    const boxMargin = { top: 30, right: 30, bottom: 0, left: 30 };
    const barOffset = 25;

    const barsBoxWidth =
      numBars * (barMargin.left + FLIPBARLAYOUT.width + barMargin.right) +
      (boxMargin.left + boxMargin.right);
    const barsBoxHeight = FLIPBARLAYOUT.height + 50;

    const barsContainer = svg
      .append('svg')
      .attr('class', 'container')
      .attr('width', barsBoxWidth)
      .attr('height', barsBoxHeight);

    barsContainer
      .append('line')
      .attr('class', 'bars-line')
      .attr('x1', 0)
      .attr('x2', barsBoxWidth)
      .attr('y1', barOffset + FLIPBARLAYOUT.height / 2)
      .attr('y2', barOffset + FLIPBARLAYOUT.height / 2)
      .style('stroke', '#909090')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', '2,2')
      .style('stroke-linecap', 'butt');

    barsContainer
      .append('text')
      .attr('class', 'bars-line-label')
      .attr('x', 872)
      .attr('y', barOffset + FLIPBARLAYOUT.height / 2 + 12)
      .style('text-anchor', 'right')
      .text('50% of');

    barsContainer
      .append('text')
      .attr('class', 'bars-line-label')
      .attr('x', 880)
      .attr('y', barOffset + FLIPBARLAYOUT.height / 2 + 22)
      .style('text-anchor', 'right')
      .text('votes');

    barsContainer
      .append('text')
      .attr('class', 'district-bars-label')
      .attr('x', barsBoxWidth / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .text('pa congressional districts');

    barsContainer
      .append('text')
      .attr('class', 'district-bars-instructions')
      .attr('x', barsBoxWidth / 2)
      .attr('y', 250)
      .style('text-anchor', 'middle')
      .text('drag the bars to change the vote');

    const barSvg = barsContainer
      .selectAll('svg')
      .data(this.flipService.flipData)
      .enter()
      .append('svg')
      .attr('width', FLIPBARLAYOUT.width + barMargin.left + barMargin.right)
      .attr('height', FLIPBARLAYOUT.height + barMargin.top + barMargin.bottom)
      .attr('x', function (d, i) {
        return (
          boxMargin.left +
          i * (FLIPBARLAYOUT.width + barMargin.right + barMargin.left)
        );
      })
      .attr('y', barOffset);

    barSvg
      .append('g')
      .attr(
        'transform',
        'translate(' + barMargin.left + ',' + barMargin.top + ')'
      )
      .each(this.makeBar.bind(this));
  }

  makeLowerVis(svg) {
    const width = 900;
    const height = 350;

    const container = svg
      .append('svg')
      .attr('class', 'container')
      .attr('width', width)
      .attr('height', height);

    container
      .append('text')
      .attr('class', 'display-label')
      .attr('x', 525)
      .attr('y', 65)
      .style('text-anchor', 'right')
      .text('statewide votes: 5,757,009');

    container
      .append('text')
      .attr('class', 'display-label')
      .attr('x', 860 - 500 / 9)
      .attr('y', 65)
      .style('text-anchor', 'right')
      .text('seats: 18');

    const districtInfoContainer = container
      .append('g')
      .attr('class', 'district-info-container')
      .style('opacity', 0);

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info district-name');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info year')
      .text('2016 votes:')
      .style('text-anchor', 'start');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info total-votes')
      .style('text-anchor', 'end');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info cand-name dem');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info cand-votes dem')
      .style('text-anchor', 'end');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info cand-name rep');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info cand-votes rep')
      .style('text-anchor', 'end');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info cand-name oth');

    districtInfoContainer
      .append('text')
      .attr('class', 'district-info cand-votes oth')
      .style('text-anchor', 'end');

    this.makeMap(container);
    this.makeStateVotes(container);
    this.makeCongressSeats(container);
  }

  makeMap(svg) {
    const width = 475;
    const height = 300;

    const mapContainer = svg
      .append('svg')
      .attr('class', 'map-svg')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 50)
      .attr('y', 15);

    const projection = geoAlbers()
      .scale(6000)
      .rotate([77.1945, 0])
      .center([0, 41.2033])
      .translate([width / 2, height / 2]);

    const path = geoPath().projection(projection);

    const geoData = topojson.feature(
      this.flipService.flipTopojson,
      this.flipService.flipTopojson.objects.districts
    ).features;

    mapContainer
      .append('g')
      .selectAll('path')
      .data(geoData)
      .enter()
      .append('path')
      .attr('class', 'district-boundary')
      .attr('d', path)
      .attr('district', (d) => +d.properties.CD114FP)
      .attr('winner', (d) => {
        const data = this.flipService.districtsData[+d.properties.CD114FP];
        return this.flipService.getDistrictWinner(data);
      })
      .style('fill', FLIPCOLORS.initialColor)
      .on('mouseover', this.handleMapMouseOver.bind(this))
      .on('mouseout', this.handleMapMouseOut.bind(this))
      .transition()
      .delay((d) => {
        const district = +d.properties.CD114FP;
        return 300 + district * 70;
      })
      .duration(420)
      .style('fill', (d, i, nodes) => {
        if (nodes[i].getAttribute('winner') == Party.D) {
          return FLIPCOLORS.dMapColor;
        } else if (nodes[i].getAttribute('winner') == Party.R) {
          return FLIPCOLORS.rColor;
        } else {
          return FLIPCOLORS.oColor;
        }
      });
  }

  handleMapMouseOver(event, d) {
    const district = +d.properties.CD114FP;
    const container = document.getElementById(this.divId.replace('#', ''));
    this.flipService.styleMapOnHover(district, container, 'start');
    this.flipService.showDistrictInfo(
      this.flipService.districtsData[district],
      container
    );
    select(container)
      .selectAll('g.bar')
      .filter(
        (d, i, nodes: HTMLElement[]) =>
          +nodes[i].getAttribute('district') !== district
      )
      .selectAll('rect')
      .style('opacity', 0.3);
  }

  handleMapMouseOut(event, d) {
    const district = +d.properties.CD114FP;
    const container = document.getElementById(this.divId.replace('#', ''));
    this.flipService.styleMapOnHover(district, container, 'end');
    this.flipService.hideDistrictInfo(
      this.flipService.districtsData[district],
      container
    );
    select(container)
      .selectAll('g.bar')
      .filter(
        (d, i, nodes: HTMLElement[]) =>
          +nodes[i].getAttribute('district') !== district
      )
      .selectAll('rect')
      .style('opacity', 1);
  }

  makeStateVotes(svg) {
    const width = 250;
    const height = 250;
    const squareSize = 5;
    const rows = height / squareSize;
    const cols = width / squareSize;
    const numSquares = rows * cols;

    const stateVotesSvg = svg
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 525)
      .attr('y', 70)
      .append('g');

    const cutDGrid = this.flipService.stateData.dPercent * rows * cols;
    const cutOtherGrid =
      (this.flipService.stateData.dPercent +
        this.flipService.stateData.oPercent) *
      rows *
      cols;

    const delay = 2.8;
    const pause = 0;

    stateVotesSvg
      .selectAll('.grid-square')
      .data(range(numSquares))
      .enter()
      .append('rect')
      .attr('class', 'grid-square')
      .attr('width', squareSize - 0.4)
      .attr('height', squareSize - 0.4)
      .attr('cellnum', (d, i) => numSquares - i)
      .attr('x', (d, i) => squareSize * (i % cols))
      .attr('y', (d, i) => squareSize * Math.floor(i / cols))
      .style('fill', FLIPCOLORS.initialColor)
      .style('stroke', 'ffffff')
      .style('stroke-width', 0.4)
      .style('stroke-linecap', 'butt')
      .attr('squareColor', function () {
        if (this.getAttribute('cellnum') <= cutDGrid) {
          return FLIPCOLORS.dColor;
        }
        if (
          this.getAttribute('cellnum') > cutDGrid &&
          this.getAttribute('cellnum') <= cutOtherGrid
        ) {
          return FLIPCOLORS.oColor;
        } else {
          return FLIPCOLORS.rColor;
        }
      })
      .transition()
      .delay((d, i, nodes) => {
        if (nodes[i].getAttribute('squareColor') == FLIPCOLORS.dColor) {
          return pause + nodes[i].getAttribute('cellnum') * delay;
        } else if (nodes[i].getAttribute('squareColor') == FLIPCOLORS.oColor) {
          if (cutOtherGrid < numSquares / 2) {
            return (
              pause +
              (numSquares - nodes[i].getAttribute('cellnum') + 1) * delay +
              100 * delay
            );
          } else {
            return (
              pause +
              (nodes[i].getAttribute('cellnum') + 1) * delay +
              100 * delay
            );
          }
        } else if (nodes[i].getAttribute('squareColor') == FLIPCOLORS.rColor) {
          return (
            pause + (numSquares - nodes[i].getAttribute('cellnum') + 1) * delay
          );
        }
      })
      .style('fill', (d, i, nodes) => nodes[i].getAttribute('squareColor'));
  }

  makeCongressSeats(svg) {
    const width = 500 / 9;
    const height = 250;
    const squareSize = 500 / 18;
    const rows = height / squareSize;
    const cols = width / squareSize;
    const numSquares = rows * cols;

    const cutOtherGrid =
      (this.flipService.stateData.dPercent +
        this.flipService.stateData.oPercent) *
      rows *
      cols;

    const congressSvg = svg
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 860 - width)
      .attr('y', 70)
      .append('g');

    const delay = 200;
    const pause = 0;

    congressSvg
      .selectAll('.congress-square')
      .data(range(this.flipService.flipData.length))
      .enter()
      .append('rect')
      .attr('class', 'congress-square')
      .attr('width', squareSize - 1)
      .attr('height', squareSize - 1)
      .attr('cellnum', (d, i, nodes) => numSquares - i)
      .attr('x', (d, i, nodes) => squareSize * (i % cols))
      .attr('y', (d, i, nodes) => squareSize * Math.floor(i / cols))
      .style('fill', FLIPCOLORS.initialColor)
      .style('stroke', 'ffffff')
      .style('stroke-width', 1)
      .style('stroke-linecap', 'butt')
      .attr('squareColor', (d, i, nodes) =>
        this.flipService.getCongressSquareColor(nodes[i])
      )
      .transition()
      .delay((d, i, nodes) => {
        const color = this.flipService.getCongressSquareColor(nodes[i]);
        if (color == FLIPCOLORS.dColor) {
          return pause + nodes[i].getAttribute('cellnum') * delay;
        }
        if (color == FLIPCOLORS.oColor) {
          if (cutOtherGrid < numSquares / 2) {
            return (
              pause +
              (numSquares - nodes[i].getAttribute('cellnum') + 1) * delay +
              100 * delay
            );
          } else {
            return (
              pause +
              (nodes[i].getAttribute('cellnum') + 1) * delay +
              100 * delay
            );
          }
        }
        if (color == FLIPCOLORS.rColor) {
          return (
            pause + (numSquares - nodes[i].getAttribute('cellnum') + 1) * delay
          );
        }
      })
      .style('fill', (d, i, nodes) =>
        this.flipService.getCongressSquareColor(nodes[i])
      );
  }

  makeBar(datum, i, nodes) {
    const visContainer = document.getElementById(this.divId.replace('#', ''));
    const bar = new FlipBar(datum, nodes[i], visContainer, this.flipService);
  }

  resetVis() {
    select(this.divId).selectAll('svg').remove();
    this.flipService.setFlipData();
    this.makeVis();
  }
}
