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
import { Transition, select } from 'd3';
import {
  BARS,
  BarsComponent,
} from 'src/app/viz-components/bars/bars.component';
import { ChartComponent } from 'src/app/viz-components/chart/chart.component';
import { DATA_MARKS } from 'src/app/viz-components/data-marks/data-marks.token';
import { XyChartComponent } from 'src/app/viz-components/xy-chart/xy-chart.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-change-bars]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-bars.component.html',
  styleUrls: ['./change-bars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DATA_MARKS, useExisting: ChangeBarsComponent },
    { provide: BARS, useExisting: ChangeBarsComponent },
    { provide: ChartComponent, useExisting: XyChartComponent },
  ],
})
export class ChangeBarsComponent
  extends BarsComponent
  implements OnInit, OnChanges
{
  @Input() axisLabelAboveBarOffset = 20;
  @ViewChild('barsGroup', { static: true })
  barsGroupElRef: ElementRef<SVGGElement>;
  @ViewChild('backgroundGroup', { static: true })
  backgroundGroupElRef: ElementRef<SVGGElement>;
  positionAxisLabelAboveBar = true;
  maxBarLabelWidth = 40;

  override drawMarks(transitionDuration: number): void {
    this.drawBars(transitionDuration);
    this.drawZeroAxis(transitionDuration);
    if (this.config.labels) {
      this.drawBarLabels(transitionDuration);
    }
    this.updateBarElements();
  }

  override drawBars(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    select(this.backgroundGroupElRef.nativeElement)
      .selectAll('.vic-background-bar')
      .data(this.values.indicies, this.barsKeyFunction as any)
      .join('rect')
      .attr('class', 'vic-background-bar')
      .attr('transform', (i: number) => {
        const x = this.ranges.x[0];
        const y = this.getBarY(i);
        return `translate(${x},${y})`;
      })
      .attr('width', this.getBackgroundBarWidth())
      .attr('height', (i: number) => this.getBarHeight(i as number));

    this.barGroups = select(this.barsGroupElRef.nativeElement)
      .selectAll('.vic-bar-group')
      .data(this.values.indicies, this.barsKeyFunction as any)
      .join(
        (enter: any) => {
          enter = enter.append('g').attr('class', 'vic-bar-group');
          return this.transformBarGroup(enter);
        },
        (update: any) => {
          update = update.transition(t as any);
          return this.transformBarGroup(update);
        }
      );

    this.barGroups
      .selectAll('.vic-bar')
      .data((i: number) => [i])
      .join(
        (enter: any) => {
          enter = enter
            .append('rect')
            .attr('class', 'vic-bar')
            .property(
              'key',
              (i: number) => this.values[this.config.dimensions.ordinal][i]
            );
          return this.getBarProperties(enter);
        },
        (update: any) => {
          update = update.transition(t as any);
          return this.getBarProperties(update);
        }
      );
  }

  transformBarGroup(selection: any): any {
    return selection.attr('transform', (i: number) => {
      const x = this.getBarX(i);
      const y = this.getBarY(i);
      return `translate(${x},${y})`;
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

  drawZeroAxis(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    select(this.barsRef.nativeElement)
      .selectAll('.vic-bar-zero-axis')
      .data([this.xScale(0)])
      .join('line')
      .attr('class', 'vic-bar-zero-axis')
      .attr('stroke-width', 1)
      .transition(t as any)
      // .attr('stroke', (x: number) =>
      //   x === this.ranges.x[0] ? 'transparent' : mutedBlue[600]
      // )
      .attr('x1', (x: number) => x)
      .attr('x2', (x: number) => x)
      .attr('y1', this.getBarY(0))
      .attr(
        'y2',
        this.getBarY(this.values.indicies.length - 1) +
          this.getBarHeight(this.values.indicies.length - 1)
      );
  }

  override drawBarLabels(transitionDuration: number): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration) as Transition<SVGSVGElement, any, any, any>;

    this.barGroups
      .selectAll('text')
      .data((i: number) => [i])
      .join(
        (enter: any) => {
          enter = enter.append('text').attr('class', 'vic-bar-label');
          return this.getLabelProperties(enter);
        },
        (update: any) => {
          update = update.transition(t as any);
          return this.getLabelProperties(update);
        }
      );
  }

  getLabelProperties(selection: any): any {
    return selection
      .text((i: number) => this.getBarLabelText(i))
      .attr('text-anchor', (i: number) => this.getLabelTextAnchor(i))
      .style('fill', (i: number) =>
        this.positionLabelInsideBar(
          i,
          this.values[this.config.dimensions.quantitative][i] >= 0
        )
          ? 'white'
          : this.getBarLabelColor(i)
      )
      .style('display', this.config.labels.display ? null : 'none')
      .attr('x', (i: number) => this.getBarLabelInsideOutsideX(i))
      .attr('y', (i: number) => this.getBarLabelY(i));
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
      return -1 * this.xScale(0) + this.ranges.x[0];
    } else {
      return (
        this.getBarWidthQuantitative(i) - (this.xScale(0) - this.ranges.x[0])
      );
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
      ? this.ranges.x[1] - this.xScale(this.values.x[i])
      : this.xScale(this.values.x[i]) - this.ranges.x[0];
    return widthOutsideBar > this.maxBarLabelWidth;
  }

  getBarLabelFitsInsideBar(i: number, isPositiveValue: boolean): boolean {
    const widthInsideBar = isPositiveValue
      ? this.xScale(this.values.x[i]) - this.xScale(0)
      : this.xScale(0) - this.xScale(this.values.x[i]);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override getBarHeightOrdinal(i: number): number {
    let barHeight = (this.yScale as any).bandwidth();
    if (this.positionAxisLabelAboveBar) {
      barHeight -= this.axisLabelAboveBarOffset;
    }
    return barHeight;
  }

  override getBarY(i: number): number {
    let barY = this.yScale(this.values.y[i]);
    if (this.positionAxisLabelAboveBar) {
      barY += this.axisLabelAboveBarOffset;
    }
    return barY;
  }
}
