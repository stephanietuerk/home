import { ChangeDetectionStrategy, Component } from '@angular/core';
import { YearsSelectionComponent } from '../years-selection/years-selection.component';

@Component({
  selector: 'app-time-range-tab-body',
  imports: [YearsSelectionComponent],
  templateUrl: './time-range-tab-body.component.html',
  styleUrls: ['../tabs-body.scss', './time-range-tab-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeRangeTabBodyComponent {}
