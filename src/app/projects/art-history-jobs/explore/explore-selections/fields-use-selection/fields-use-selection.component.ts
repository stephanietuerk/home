import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExploreDataService } from '../../explore-data.service';
import { fieldsUseOptions } from '../explore-selections.constants';
import { FilterType } from '../explore-selections.model';

@Component({
  selector: 'app-fields-use-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fields-use-selection.component.html',
  styleUrls: ['./fields-use-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsUseSelectionComponent {
  options = fieldsUseOptions;

  constructor(public data: ExploreDataService) {}

  updateFieldsUse(fieldsUse: keyof typeof FilterType): void {
    this.data.updateSelections({ fieldsUse });
  }
}
