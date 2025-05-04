/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  extent,
  group,
  InternSet,
  line,
  map,
  max,
  min,
  range,
  scaleOrdinal,
  scaleTime,
  scaleUtc,
  select,
  Transition,
} from 'd3';
import { ChartComponent } from '../chart/chart.component';
import { DataDomainService } from '../core/services/data-domain.service';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { XyDataMarks, XyDataMarksValues } from '../data-marks/xy-data-marks';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { XyDataMarksBase } from '../xy-chart/xy-data-marks-base';
import { VicLinesConfig } from './lines.config';

export interface Marker {
  key: string;
  index: number;
}

export class LinesTooltipData {
  datum: any;
  color: string;
  x: string;
  y: string;
  category: string;
}

export const LINES = new InjectionToken<LinesComponent>('LinesComponent');

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-lines]',
  standalone: true,
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: LinesComponent },
    { provide: LINES, useExisting: LinesComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class LinesComponent
  extends XyDataMarksBase
  implements XyDataMarks, OnChanges, OnInit
{
  @ViewChild('lines', { static: true }) linesRef: ElementRef<SVGSVGElement>;
  @ViewChild('dot', { static: true }) dotRef: ElementRef<SVGSVGElement>;
  @ViewChild('markers', { static: true }) markersRef: ElementRef<SVGSVGElement>;
  @ViewChild('lineLabels', { static: true })
  lineLabelsRef: ElementRef<SVGSVGElement>;
  @Input() config: VicLinesConfig;
  values: XyDataMarksValues = new XyDataMarksValues();
  line: (x: any[]) => any;
  linesD3Data;
  linesKeyFunction;
  markersD3Data;
  markersKeyFunction;
  markerClass = 'vic-lines-datum-marker';
  markerIndexAttr = 'index';
  unpaddedDomain: {
    x: [any, any];
    y: [any, any];
  } = { x: undefined, y: undefined };
  lineEndPoints: { category: string; index: number; y: number }[];

  private zone = inject(NgZone);
  private dataDomainService = inject(DataDomainService);

  get lines(): any {
    return select(this.linesRef.nativeElement).selectAll('path');
  }

  get hoverDot(): any {
    return select(this.dotRef.nativeElement).selectAll('circle');
  }

  get markers(): any {
    return select(this.markersRef.nativeElement).selectAll('circle');
  }

  get lineLabels(): any {
    return select(this.lineLabelsRef.nativeElement).selectAll('text');
  }

  /**
   * setPropertiesFromConfig method
   *
   * This method handles an update to the config object. Methods called from here should not
   * requires ranges or scales. This method is called on init and on config update.
   */
  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initDomains();
    this.setValueIndicies();
    this.initCategoryScale();
    this.setLinesD3Data();
    this.setLinesKeyFunction();
    this.setMarkersD3Data();
    this.setMarkersKeyFunction();
  }

  setValueArrays(): void {
    this.values.x = map(this.config.data, this.config.x.valueAccessor);
    this.values.y = map(this.config.data, this.config.y.valueAccessor);
    this.values.category = map(
      this.config.data,
      this.config.category.valueAccessor
    );
  }

  initDomains(): void {
    this.setUnpaddedDomains();
    if (this.config.category.domain === undefined) {
      this.config.category.domain = this.values.category;
    }
  }

  setUnpaddedDomains(): void {
    this.unpaddedDomain.x =
      this.config.x.domain === undefined
        ? extent(this.values.x)
        : this.config.x.domain;
    this.unpaddedDomain.y =
      this.config.y.domain === undefined
        ? [min([min(this.values.y), 0]), max(this.values.y)]
        : this.config.y.domain;
  }

  setValueIndicies(): void {
    const domainInternSet = new InternSet(this.config.category.domain);
    this.values.indicies = range(this.values.x.length).filter((i) =>
      domainInternSet.has(this.values.category[i])
    );
  }

  initCategoryScale(): void {
    if (this.config.category.colorScale === undefined) {
      this.config.category.colorScale = scaleOrdinal(
        new InternSet(this.config.category.domain),
        this.config.category.colors
      );
    }
  }

  setLinesD3Data(): void {
    const definedIndices = this.values.indicies.filter(
      (i) =>
        this.canBeDrawnByPath(this.values.x[i]) &&
        this.canBeDrawnByPath(this.values.y[i])
    );
    this.linesD3Data = group(definedIndices, (i) => this.values.category[i]);
  }

  canBeDrawnByPath(x: any): boolean {
    return (
      (typeof x === 'number' || this.utilities.isDate(x)) &&
      x !== null &&
      x !== undefined
    );
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

  /**
   * setChartScalesFromRanges method
   *
   * This method sets creates and sets scales on ChartComponent. Any methods that require ranges
   * to create the scales should be called from this method. Methods called from here should not
   * require scales.
   *
   * This method is called on init, after config-based properties are set, and also on
   * resize/when ranges change.
   */
  setChartScalesFromRanges(useTransition: boolean): void {
    const paddedXDomain = this.getPaddedDomain('x');
    const paddedYDomain = this.getPaddedDomain('y');
    const x = this.config.x.scaleType(paddedXDomain, this.ranges.x);
    const y = this.config.y.scaleType(paddedYDomain, this.ranges.y);
    const category = this.config.category.colorScale;
    this.zone.run(() => {
      this.chart.updateScales({ x, y, category, useTransition });
    });
  }

  getPaddedDomain(dimension: 'x' | 'y'): [any, any] {
    if (
      this.config[dimension].scaleType !== scaleTime &&
      this.config[dimension].scaleType !== scaleUtc
    ) {
      const paddedDomain = this.dataDomainService.getQuantitativeDomain(
        this.unpaddedDomain[dimension],
        this.config[dimension].domainPadding,
        this.config[dimension].scaleType,
        this.ranges[dimension]
      );
      return paddedDomain;
    } else {
      return this.unpaddedDomain[dimension];
    }
  }

  drawMarks(): void {
    this.setLine();
    const transitionDuration = this.getTransitionDuration();
    this.drawLines(transitionDuration);
    if (this.config.pointMarkers.display) {
      this.drawPointMarkers(transitionDuration);
    } else if (this.config.hoverDot.display) {
      this.drawHoverDot();
    }
    this.drawLineLabels();
  }

  setLine(): void {
    if (this.config.valueIsDefined === undefined) {
      this.config.valueIsDefined = (d, i) =>
        this.canBeDrawnByPath(this.values.x[i]) &&
        this.canBeDrawnByPath(this.values.y[i]);
    }
    const isDefinedValues = map(this.config.data, this.config.valueIsDefined);

    this.line = line()
      .defined((i: any) => isDefinedValues[i] as boolean)
      .curve(this.config.curve)
      .x((i: any) => this.scales.x(this.values.x[i]))
      .y((i: any) => this.scales.y(this.values.y[i]));
  }

  drawLines(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.lines.data(this.linesD3Data, this.linesKeyFunction).join(
      (enter) =>
        enter
          .append('path')
          .attr('key', ([category]) => category)
          .attr('class', 'vic-line')
          .attr('stroke', ([category]) => this.scales.category(category))
          .attr('d', ([, lineData]) => this.line(lineData)),
      (update) =>
        update
          .attr('stroke', ([category]) => this.scales.category(category))
          .call((update) =>
            update
              .transition(t as any)
              .attr('d', ([, lineData]) => this.line(lineData))
          ),
      (exit) => exit.remove()
    );
  }

  drawHoverDot(): void {
    select(this.dotRef.nativeElement)
      .append('circle')
      .attr('class', 'vic-tooltip-dot')
      .attr('r', this.config.hoverDot.radius)
      .attr('fill', '#222')
      .attr('display', 'none');
  }

  drawPointMarkers(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.markers.data(this.markersD3Data, this.markersKeyFunction).join(
      (enter) =>
        enter
          .append('circle')
          .attr('class', this.markerClass)
          .attr('key', (d) => d.key)
          .attr(this.markerIndexAttr, (d) => d.index)
          .style('mix-blend-mode', this.config.mixBlendMode)
          .attr('cx', (d) => this.scales.x(this.values.x[d.index]))
          .attr('cy', (d) => this.scales.y(this.values.y[d.index]))
          .attr('r', this.config.pointMarkers.radius)
          .attr('fill', (d) =>
            this.scales.category(this.values.category[d.index])
          ),
      (update) =>
        update
          .attr('fill', (d) =>
            this.scales.category(this.values.category[d.index])
          )
          .call((update) =>
            update
              .transition(t as any)
              .attr('cx', (d) => this.scales.x(this.values.x[d.index]))
              .attr('cy', (d) => this.scales.y(this.values.y[d.index]))
          ),
      (exit) => exit.remove()
    );
  }

  drawLineLabels(): void {
    this.lineEndPoints = [];
    if (this.config.labels.display) {
      this.linesD3Data.forEach((values, key) => {
        const lastPoint = values[values.length - 1];
        this.lineEndPoints.push({
          category: key,
          index: lastPoint,
          y: this.scales.y(this.values.y[lastPoint]),
        });
      });
      this.lineEndPoints.sort((a, b) => a.y - b.y);
    }
    // TODO: make more flexible (or its own element? currently this only puts labels on the right side of the chart
    select(this.lineLabelsRef.nativeElement)
      .selectAll('text')
      .data(this.lineEndPoints)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'vic-line-label')
            .attr('text-anchor', 'end')
            .style('display', (d, i) => this.lineLabelShouldBeDisplayed(d.y, i))
            .attr('fill', (d) =>
              this.scales.category(this.values.category[d.index])
            )
            .attr('x', (d) => `${this.scales.x(this.values.x[d.index]) - 4}px`)
            .attr('y', (d) => `${d.y - 8}px`)
            .text((d) => this.config.labels.format(d.category)),
        (update) =>
          update
            .attr('fill', (d) =>
              this.scales.category(this.values.category[d.index])
            )
            .call((update) =>
              update
                .transition()
                .duration(this.chart.transitionDuration)
                .style('display', (d, i) =>
                  this.lineLabelShouldBeDisplayed(d.y, i)
                )
                .attr(
                  'x',
                  (d) => `${this.scales.x(this.values.x[d.index]) - 4}px`
                )
                .attr('y', (d) => `${d.y - 8}px`)
                .text((d) => this.config.labels.format(d.category))
            ),
        (exit) => exit.remove()
      );
  }

  lineLabelShouldBeDisplayed(y: number, i: number): 'inline-block' | 'none' {
    if (i === 0) {
      return 'inline-block';
    } else {
      return y - this.lineEndPoints[i - 1].y > this.config.labels?.minSpacing
        ? 'inline-block'
        : 'none';
    }
  }
}
