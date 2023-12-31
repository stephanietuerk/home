import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExploreDataService } from '../../explore-data.service';
import { valueTypeOptions } from '../explore-selections.constants';
import { ValueType } from '../explore-selections.model';

@Component({
  selector: 'app-value-type-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './value-type-selection.component.html',
  styleUrls: ['./value-type-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueTypeSelectionComponent {
  valueTypeOptions = valueTypeOptions;

  constructor(public data: ExploreDataService) {}

  updateValueType(valueType: keyof typeof ValueType): void {
    this.data.updateSelections({ valueType: valueType });
  }
}
