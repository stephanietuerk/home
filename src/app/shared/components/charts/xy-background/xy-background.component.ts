import { Component, Input } from '@angular/core';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[xy-background]',
    templateUrl: './xy-background.component.html',
    styleUrls: ['./xy-background.component.scss'],
})
export class XYBackgroundComponent {
    @Input() color = 'whitesmoke';

    constructor(public xySpace: XYChartSpaceComponent) {}
}
