import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { select } from 'd3';
import { Selection } from 'd3-selection';
import { VicXQuantitativeAxisModule } from 'src/app/viz-components/axes/x-quantitative/x-quantitative-axis.module';
import {
  BARS,
  BarsComponent,
} from 'src/app/viz-components/bars/bars.component';
import { ChartComponent } from 'src/app/viz-components/chart/chart.component';
import { DATA_MARKS } from 'src/app/viz-components/data-marks/data-marks.token';
import {
  XyChartComponent,
  XyContentScale,
} from 'src/app/viz-components/xy-chart/xy-chart.component';
import { ChangeChartComponent } from '../change-chart/change-chart.component';
import { ChangeChartConfig } from '../explore-change-chart.model';

type BarContainerSelection = Selection<
  HTMLDivElement,
  number,
  HTMLDivElement,
  unknown
>;
type BarCategoryLabelSelection = Selection<
  HTMLParagraphElement,
  number,
  HTMLDivElement,
  number
>;
type BarSvgGSelection = Selection<SVGGElement, number, SVGSVGElement, number>;
type BarGSelection = Selection<SVGGElement, number, SVGGElement, number>;
type BarSelection = Selection<SVGRectElement, number, SVGGElement, number>;
type BarValueLabelSelection = Selection<
  SVGTextElement,
  number,
  SVGGElement,
  number
>;

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-change-bars',
    imports: [CommonModule, VicXQuantitativeAxisModule],
    templateUrl: './change-bars.component.html',
    styleUrls: ['./change-bars.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DATA_MARKS, useExisting: ChangeBarsComponent },
        { provide: BARS, useExisting: ChangeBarsComponent },
        { provide: ChartComponent, useExisting: ChangeChartComponent },
        { provide: XyChartComponent, useExisting: ChangeChartComponent },
    ]
})
export class ChangeBarsComponent
  extends BarsComponent
  implements OnInit, OnChanges
{
  @Input() override config: ChangeChartConfig;
  @ViewChild('barsContainer', { static: true })
  barsContainerRef: ElementRef<HTMLDivElement>;
  barContainerSel: BarContainerSelection;
  barCategoryLabelSel: BarCategoryLabelSelection;
  barSvgGSel: BarSvgGSelection;
  barGSel: BarGSelection;
  barSel: BarSelection;
  barValueLabelSel: BarValueLabelSelection;
  maxBarLabelWidth = 40;

  constructor() {
    super();
  }

  override setRequiredChartScales(): void {
    this.requiredScales = [XyContentScale.x];
  }

  override updateBarElements(): void {
    const bars = select(this.barsContainerRef.nativeElement).selectAll('svg');
    const labels = bars.selectAll('text');
    this.bars.next(bars);
    this.barLabels.next(labels);
  }

  override getOrdinalScale(): any {
    return null;
  }

  override drawBars(transitionDuration: number): void {
    const t = select(this.barsContainerRef.nativeElement)
      .transition()
      .duration(transitionDuration);
    this.barContainerSel = select(this.barsContainerRef.nativeElement)
      .selectAll<HTMLDivElement, number[]>('.bar-container')
      .data(this.values.indicies, this.barsKeyFunction)
      .join((enter) => enter.append('div'))
      .style('--chart-margin-left', `${this.chart.margin.left}px`)
      .attr('class', () =>
        this.config.categoryLabelsAboveBars
          ? 'bar-container column'
          : 'bar-container row'
      );
    this.barCategoryLabelSel = this.barContainerSel
      .selectAll<HTMLParagraphElement, number[]>('.bar-category-label')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('p')
            .attr('class', 'bar-category-label')
            .text((i) => this.values[this.config.dimensions.ordinal][i]),
        (update) =>
          update.text((i) => this.values[this.config.dimensions.ordinal][i]),
        (exit) => exit.remove()
      );
    const svg = this.barContainerSel
      .selectAll<SVGSVGElement, number[]>('.vic-chart-svg')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('svg')
            .attr('class', 'vic-chart-svg')
            .attr(
              'category',
              (i) => this.values[this.config.dimensions.ordinal][i]
            )
            .style('mix-blend-mode', this.config.mixBlendMode)
            .attr('width', () => {
              const width =
                this.ranges.x[1] -
                this.ranges.x[0] +
                this.chart.margin.left +
                this.chart.margin.right;
              return width;
            })
            .attr('height', this.config.barHeight),
        (update) =>
          update
            .attr(
              'category',
              (i) => this.values[this.config.dimensions.ordinal][i]
            )
            .attr('width', () => {
              const width =
                this.ranges.x[1] -
                this.ranges.x[0] +
                this.chart.margin.left +
                this.chart.margin.right;
              return width;
            })
            .attr('height', this.config.barHeight),
        (exit) => exit.remove()
      );
    this.barSvgGSel = svg
      .selectAll<SVGSVGElement, number[]>('.vic-chart-svg-g')
      .data((i) => [i])
      .join('g')
      .attr('class', 'vic-chart-svg-g');
    this.barSvgGSel
      .selectAll('.background-bar')
      .data((i) => [i])
      .join('rect')
      .attr('class', 'background-bar')
      .attr('width', this.getBackgroundBarWidth())
      .attr('height', this.config.barHeight)
      .attr(
        'x',
        this.config.categoryLabelsAboveBars ? this.chart.margin.left : 0
      )
      .attr('fill', 'whitesmoke');
    this.barGSel = this.barSvgGSel
      .selectAll<SVGGElement, number[]>('.bar-g')
      .data((i) => [i])
      .join('g')
      .attr('class', 'bar-g');
    this.transformBarGroup(this.barGSel);
    this.barSel = this.barGSel
      .selectAll<SVGRectElement, number[]>('.data-bar')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'data-bar')
            .attr('width', (i) => this.getBarWidth(i))
            .attr('height', this.config.barHeight)
            .attr('fill', (i) =>
              this.config.patternPredicates
                ? this.getBarPattern(i)
                : this.getBarColor(i)
            ),
        (update) =>
          update
            .transition(t)
            .attr('width', (i) => this.getBarWidth(i))
            .attr('height', this.config.barHeight)
            .attr('fill', (i) =>
              this.config.patternPredicates
                ? this.getBarPattern(i)
                : this.getBarColor(i)
            ),
        (exit) => exit.remove()
      );
    this.barGSel
      .selectAll<SVGLineElement, number[]>('.zero-axis')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('class', 'zero-axis')
            .attr('y1', 0)
            .attr('y2', this.config.barHeight)
            .attr('x1', (i) => this.getZeroAxisX(i))
            .attr('x2', (i) => this.getZeroAxisX(i)),
        (update) =>
          update
            .transition(t)
            .attr('y1', 0)
            .attr('y2', this.config.barHeight)
            .attr('x1', (i) => this.getZeroAxisX(i))
            .attr('x2', (i) => this.getZeroAxisX(i)),
        (exit) => exit.remove()
      );
  }

  transformBarGroup(selection: any): any {
    return selection.attr('transform', (i: number) => {
      const x = this.getBarX(i);
      return `translate(${x},${0})`;
    });
  }

  getBarProperties(selection: any): any {
    return selection
      .attr('width', (i: number) => this.getBarWidth(i as number))
      .attr('height', (i: number) => this.getBarHeight(i as number))
      .attr('fill', (i: number) =>
        this.config.patternPredicates
          ? this.getBarPattern(i as number)
          : this.getBarColor(i as number)
      );
  }

  override drawBarLabels(transitionDuration: number): void {
    const t = select(this.barsContainerRef.nativeElement)
      .transition()
      .duration(transitionDuration);
    this.barValueLabelSel = this.barGSel
      .selectAll<SVGTextElement, number[]>('.data-value-label')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'data-value-label')
            .attr('x', (i) => this.getBarLabelInsideOutsideX(i))
            .attr('y', (i) => this.config.barHeight / 2)
            .style('fill', (i) =>
              this.positionLabelInsideBar(
                i,
                this.values[this.config.dimensions.quantitative][i] >= 0
              )
                ? 'white'
                : this.getBarLabelColor(i)
            )
            .style('display', this.config.labels.display ? null : 'none')
            .style('alignment-baseline', 'middle')
            .text((i) => this.getBarLabelText(i))
            .attr('text-anchor', (i) => this.getLabelTextAnchor(i)),
        (update) =>
          update
            .transition(t)
            .attr('x', (i) => this.getBarLabelInsideOutsideX(i))
            .attr('y', (i) => this.config.barHeight / 2)
            .style('fill', (i) =>
              this.positionLabelInsideBar(
                i,
                this.values[this.config.dimensions.quantitative][i] >= 0
              )
                ? 'white'
                : this.getBarLabelColor(i)
            )
            .style('display', this.config.labels.display ? null : 'none')
            .style('alignment-baseline', 'middle')
            .text((i) => this.getBarLabelText(i))
            .attr('text-anchor', (i) => this.getLabelTextAnchor(i)),
        (exit) => exit.remove()
      );
  }

  getLabelTextAnchor(i: number): 'start' | 'end' {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (value === null) {
      return 'start';
    }
    const isPositiveValue = value >= 0;
    const labelOutside = this.getBarLabelFitsOutsideBar(i, isPositiveValue);
    if (isPositiveValue) {
      return labelOutside ? 'start' : 'end';
    } else {
      return labelOutside ? 'end' : 'start';
    }
  }

  getBackgroundBarX(i: number): number {
    const isPositiveValue =
      this.values[this.config.dimensions.quantitative][i] >= 0;
    if (isPositiveValue) {
      return -1 * this.scales.x(0) + this.ranges.x[0];
    } else {
      return (
        this.getBarWidthQuantitative(i) - (this.scales.x(0) - this.ranges.x[0])
      );
    }
  }

  getZeroAxisX(i: number): number {
    const isPositiveValue =
      this.values[this.config.dimensions.quantitative][i] >= 0;
    if (isPositiveValue) {
      return 0;
    } else {
      return this.getBarWidthQuantitative(i);
    }
  }

  getBackgroundBarWidth(): number {
    return this.ranges.x[1] - this.ranges.x[0];
  }

  override getBarLabelX(i: number): number {
    const isPositiveValue =
      this.values[this.config.dimensions.quantitative][i] >= 0;
    if (isPositiveValue) {
      let barEnd = this.getBarWidthQuantitative(i);
      if (!barEnd || isNaN(barEnd)) {
        barEnd = 0;
      }
      return barEnd + this.config.labels.offset;
    } else {
      return -1 * this.config.labels.offset;
    }
  }

  positionLabelInsideBar(i: number, isPositiveValue: boolean): boolean {
    // TODO: future feature - create maxBarLabelWidth dynamically based on length of d3 formatted data label
    return (
      !this.getBarLabelFitsOutsideBar(i, isPositiveValue) &&
      this.getBarLabelFitsInsideBar(i, isPositiveValue)
    );
  }

  getBarLabelFitsOutsideBar(i: number, isPositiveValue: boolean): boolean {
    const widthOutsideBar = isPositiveValue
      ? this.ranges.x[1] - this.scales.x(this.values.x[i])
      : this.scales.x(this.values.x[i]) - this.ranges.x[0];
    return widthOutsideBar > this.maxBarLabelWidth;
  }

  getBarLabelFitsInsideBar(i: number, isPositiveValue: boolean): boolean {
    const widthInsideBar = isPositiveValue
      ? this.scales.x(this.values.x[i]) - this.scales.x(0)
      : this.scales.x(0) - this.scales.x(this.values.x[i]);
    return widthInsideBar >= this.maxBarLabelWidth;
  }

  getBarLabelInsideOutsideX(i: number): number {
    const value = this.values[this.config.dimensions.quantitative][i];
    if (value === null) {
      return this.config.labels.offset;
    }
    const isPositiveValue = value >= 0;
    return this.positionLabelInsideBar(i, isPositiveValue)
      ? this.getBarLabelInsideX(i, isPositiveValue)
      : this.getBarLabelOutsideX(i, isPositiveValue);
  }

  getBarLabelInsideX(i: number, isPositiveValue: boolean): number {
    const positiveDataLabelOffset = 12;
    const origin = this.getBarLabelX(i);
    return isPositiveValue ? origin - positiveDataLabelOffset : -1 * origin;
  }

  getBarLabelOutsideX(i: number, isPositiveValue: boolean): number {
    if (this.getBarLabelFitsOutsideBar(i, isPositiveValue)) {
      return this.getBarLabelX(i);
    } else {
      return isPositiveValue
        ? -this.config.labels.offset
        : this.getBarWidthQuantitative(i) + this.config.labels.offset;
    }
  }
}
