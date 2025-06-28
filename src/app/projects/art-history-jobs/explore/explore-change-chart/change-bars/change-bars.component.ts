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
import { VicXyAxisModule } from '../../../../../viz-components-new/axes';
import {
  BarDatum,
  BARS,
  BarsComponent,
} from '../../../../../viz-components-new/bars';
import {
  ChartComponent,
  XyChartComponent,
  XyContentScale,
} from '../../../../../viz-components-new/charts';
import { VIC_PRIMARY_MARKS } from '../../../../../viz-components-new/marks';
import { ChangeChartComponent } from '../change-chart/change-chart.component';

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

type BarsElement = 'div' | 'g' | 'bar' | 'label' | 'background';

@Component({
  selector: 'app-change-bars',
  imports: [CommonModule, VicXyAxisModule],
  templateUrl: './change-bars.component.html',
  styleUrls: ['./change-bars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: ChangeBarsComponent },
    { provide: BARS, useExisting: ChangeBarsComponent },
    { provide: ChartComponent, useExisting: ChangeChartComponent },
    { provide: XyChartComponent, useExisting: ChangeChartComponent },
  ],
})
export class ChangeBarsComponent<Datum>
  extends BarsComponent<Datum, string>
  implements OnInit, OnChanges
{
  @Input() barHeight: number;
  @ViewChild('barsContainer', { static: true })
  barsContainerRef: ElementRef<HTMLDivElement>;
  barDivs: BarContainerSelection;
  barLabelPs: BarCategoryLabelSelection;
  maxBarLabelWidth = 40;
  override requiredScales = [XyContentScale.x];

  constructor() {
    super();
  }

  override get class(): Record<BarsElement, string> {
    return {
      div: this.config.marksClass + '-div',
      g: this.config.marksClass + '-group',
      bar: this.config.marksClass + '-bar',
      label: this.config.marksClass + '-label',
      background: this.config.marksClass + '-background',
    };
  }

  override updateBarElements(): void {
    const barEventElementsSelector = this.config.backgrounds?.events
      ? `.${this.class.bar}, .${this.class.background}`
      : `.${this.class.bar}`;
    const bars = select(this.barsContainerRef.nativeElement).selectAll<
      SVGRectElement,
      number
    >(barEventElementsSelector);
    const labels = select(this.barsContainerRef.nativeElement).selectAll<
      SVGTextElement,
      number
    >(`.${this.class.label}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.bars.next(bars as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.labels.next(labels as any);
  }

  override drawBars(transitionDuration: number): void {
    this.barDivs = select(this.barsContainerRef.nativeElement)
      .selectAll<HTMLDivElement, number>(`.${this.class.div}`)
      .data<number>(this.config.valueIndices, this.config.barsKeyFunction)
      .join((enter) =>
        enter
          .append('div')
          .attr('class', (i) =>
            `${this.class.div} ${this.config.datumClass(this.config.data[i], i)} column`.trim()
          )
      );

    this.barLabelPs = this.barDivs
      .selectAll<HTMLParagraphElement, number>('.bar-category-label')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('p')
            .attr('class', 'bar-category-label')
            .style('margin-left', `${this.chart.config.margin.left}px`)
            .text((i) => this.config.ordinal.values[i]),
        (update) => update.text((i) => this.config.ordinal.values[i]),
        (exit) => exit.remove()
      );

    const barSvgs = this.barDivs
      .selectAll<SVGSVGElement, number>('.vic-chart-svg')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('svg')
            .attr('class', 'vic-chart-svg')
            .attr('category', (i) => this.config.ordinal.values[i])
            .style('mix-blend-mode', this.config.mixBlendMode)
            .attr('width', () => {
              const width =
                this.ranges.x[1] -
                this.ranges.x[0] +
                this.chart.config.margin.left +
                this.chart.config.margin.right;
              return width;
            })
            .attr('height', this.barHeight),
        (update) =>
          update
            .attr('category', (i) => this.config.ordinal.values[i])
            .attr('width', () => {
              const width =
                this.ranges.x[1] -
                this.ranges.x[0] +
                this.chart.config.margin.left +
                this.chart.config.margin.right;
              return width;
            })
            .attr('height', this.barHeight),
        (exit) => exit.remove()
      );

    this.barGroups = barSvgs
      .selectAll<SVGSVGElement, number>(`.${this.class.g}`)
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('g')
            .attr('class', this.class.g)
            .attr('transform', (i) =>
              this.getBarGroupTransform(this.getBarDatumFromIndex(i))
            ),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition()
            .duration(transitionDuration)
            .attr('transform', (i) =>
              this.getBarGroupTransform(this.getBarDatumFromIndex(i))
            ),
        (exit) => exit.remove()
      );

    this.barGroups
      .selectAll<SVGRectElement, BarDatum<string>>(`.${this.class.bar}`)
      .data<BarDatum<string>>((i) => [this.getBarDatumFromIndex(i)])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', this.class.bar)
            .property('key', (d) => d.ordinal)
            .attr('width', (d) => this.getBarWidth(d))
            .attr('height', this.getBarHeight())
            .attr('fill', (d) => this.getBarFill(d)),
        (update) =>
          update
            .transition()
            .duration(transitionDuration)
            .attr('width', (d) => this.getBarWidth(d))
            .attr('height', this.getBarHeight())
            .attr('fill', (d) => this.getBarFill(d)),
        (exit) => exit.remove()
      );

    this.barGroups
      .selectAll<SVGLineElement, number[]>('.zero-axis')
      .data((i) => [i])
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('class', 'zero-axis')
            .attr('y1', 0)
            .attr('y2', this.getBarHeight())
            .attr('x1', (i) => this.getZeroAxisX(i))
            .attr('x2', (i) => this.getZeroAxisX(i)),
        (update) =>
          update
            .transition()
            .duration(transitionDuration)
            .attr('y1', 0)
            .attr('y2', this.getBarHeight())
            .attr('x1', (i) => this.getZeroAxisX(i))
            .attr('x2', (i) => this.getZeroAxisX(i)),
        (exit) => exit.remove()
      );
  }

  override drawBackgrounds(transitionDuration: number): void {
    this.barGroups
      .selectAll<SVGRectElement, number>(`.${this.class.background}`)
      .data<BarDatum<string>>((i) => [this.getBarDatumFromIndex(i)])
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', this.class.background)
            .attr('fill', this.config.backgrounds.color)
            .attr('transform', (d) => this.getBackgroundTransform(d))
            .attr('width', this.getBackgroundWidth())
            .attr('height', this.getBackgroundBarHeight()),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition()
            .duration(transitionDuration)
            .attr('transform', (d) => this.getBackgroundTransform(d))
            .attr('width', this.getBackgroundWidth())
            .attr('height', this.getBackgroundBarHeight()),
        (exit) => exit.remove()
      )
      .lower();
  }

  override drawLabels(transitionDuration: number): void {
    this.barGroups
      .selectAll<SVGTextElement, BarDatum<string>>(`.${this.class.label}`)
      .data<BarDatum<string>>((i: number) => [
        {
          index: i,
          quantitative: this.config.quantitative.values[i],
          ordinal: this.config.ordinal.values[i],
          color: this.config.color.values[i],
        },
      ])
      .join(
        (enter) =>
          enter
            .append<SVGTextElement>('text')
            .attr('class', this.class.label)
            .style('display', this.config.labels.display ? null : 'none')
            .text((d) => this.getLabelText(d))
            .style('visiblity', 'hidden')
            .call((selection) => {
              selection.each((d, i, nodes) => {
                const bbox = nodes[i].getBBox();
                select<SVGTextElement, BarDatum<string>>(nodes[i])
                  .style('fill', (d) => this.getLabelColor(d, bbox))
                  .attr('text-anchor', (d) => this.getLabelTextAnchor(d, bbox))
                  .attr('dominant-baseline', (d) =>
                    this.getLabelDominantBaseline(d, bbox)
                  )
                  .attr('x', this.getLabelX(d, bbox))
                  .attr('y', this.getLabelY())
                  .attr('visibility', 'visible');
              });
            }),
        (update) =>
          update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .transition()
            .duration(transitionDuration)
            .text((d) => this.getLabelText(d))
            .style('visiblity', 'hidden')
            .call((selection) => {
              selection.each((d, i, nodes) => {
                const bbox = nodes[i].getBBox();
                select<SVGTextElement, BarDatum<string>>(nodes[i])
                  .style('fill', (d) => this.getLabelColor(d, bbox))
                  .attr('text-anchor', (d) => this.getLabelTextAnchor(d, bbox))
                  .attr('dominant-baseline', (d) =>
                    this.getLabelDominantBaseline(d, bbox)
                  )
                  .attr('x', this.getLabelX(d, bbox))
                  .attr('y', this.getLabelY())
                  .attr('visibility', 'visible');
              });
            }),
        (exit) => exit.remove()
      );
  }

  override getBarGroupTransform(datum: BarDatum<string>): string {
    const x = this.getBarX(datum);
    return `translate(${x},0)`;
  }

  override getLabelY(): number {
    return this.barHeight / 2;
  }

  override getBackgroundBarHeight(): number {
    return this.barHeight;
  }

  override getBarHeight(): number {
    return this.barHeight;
  }

  getZeroAxisX(i: number): number {
    const isPositiveValue = this.config.quantitative.values[i] >= 0;
    if (isPositiveValue) {
      return 0;
    } else {
      return this.getBarDimensionQuantitative(
        this.getBarDatumFromIndex(i),
        'x'
      );
    }
  }

  getBackgroundBarWidth(): number {
    return this.ranges.x[1] - this.ranges.x[0];
  }
}
