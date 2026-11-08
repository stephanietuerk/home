import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ValueTypeSelectionComponent } from '../value-type-selection/value-type-selection.component';

@Component({
  selector: 'app-value-type-tab-body',
  imports: [ValueTypeSelectionComponent],
  templateUrl: './value-type-tab-body.component.html',
  styleUrls: ['../tabs-body.scss', './value-type-tab-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueTypeTabBodyComponent {}
