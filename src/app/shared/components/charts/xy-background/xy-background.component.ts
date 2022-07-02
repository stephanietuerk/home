import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[xy-background]',
    templateUrl: './xy-background.component.html',
    styleUrls: ['./xy-background.component.scss'],
})
export class XyBackgroundComponent {
    @Input() color = 'whitesmoke';

    constructor(public chart: ChartComponent, private cd: ChangeDetectorRef) {}
}
