import { Component, Input } from '@angular/core';
import { XyChartComponent } from '../xy-chart/xy-chart.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[xy-background]',
  templateUrl: './xy-background.component.html',
  styleUrls: ['./xy-background.component.scss'],
})
export class XYBackgroundComponent {
  @Input() color = 'whitesmoke';
  xScale: any;
  yScale: any;

  constructor(public chart: XyChartComponent) {}
}
