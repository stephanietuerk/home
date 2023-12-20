import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select } from 'd3';
import { map } from 'rxjs';
import { YOrdinalAxisComponent } from 'src/app/viz-components/axes/y-ordinal/y-ordinal-axis.component';
import { XyChartComponent } from 'src/app/viz-components/xy-chart/xy-chart.component';

@Component({
  selector: 'app-change-y-axis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-y-axis.component.html',
  styleUrls: ['./change-y-axis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeYAxisComponent extends YOrdinalAxisComponent {
  constructor(chart: XyChartComponent) {
    super(chart);
  }

  override setAxis(axisFunction: any): void {
    super.setAxis(axisFunction);
    this.axis.tickPadding(0);
    this.axis.tickSize(0);
  }

  override setTranslate(): void {
    this.translate$ = this.chart.ranges$.pipe(
      map((ranges) => {
        // const translate = this.getTranslateDistance(ranges);
        const yOffset = 10;
        return `translate(${this.chart.margin.left}, -${yOffset})`;
      })
    );
  }

  override drawAxis(transitionDuration: number): void {
    const t = select(this.axisRef.nativeElement)
      .transition()
      .duration(transitionDuration);

    select(this.axisRef.nativeElement)
      .transition(t as any)
      .call(this.axis)
      .on('end', (d, i, nodes) => {
        const tickText = select(nodes[i]).selectAll('.tick text');
        tickText.attr('text-anchor', 'start');
        if (this.config.tickLabelFontSize) {
          this.setTickFontSize(tickText);
        }
        if (this.config.wrap) {
          this.wrapAxisTickText(tickText);
        }
      });
  }

  // override wrapAxisTickText(tickTextSelection: any): void {
  //   this.positionAxisLabelAboveBar$
  //     .pipe(withLatestFrom(this.chart.svgDimensions$))
  //     .subscribe(([positionAxisLabelAboveBar, dimensions]) => {
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       const { wrapWidth, ...properties } = this.config.wrap;
  //       const config = Object.assign(
  //         new SvgTextWrapConfig(),
  //         properties
  //       ) as SvgTextWrapConfig;
  //       let width: number;
  //       if (positionAxisLabelAboveBar) {
  //         width = dimensions.width - this.chart.margin.left;
  //       } else {
  //         width = this.config.wrap.wrapWidth as number;
  //       }
  //       config.width = width;
  //       tickTextSelection.call(svgTextWrap, config);
  //     });
  // }
}
