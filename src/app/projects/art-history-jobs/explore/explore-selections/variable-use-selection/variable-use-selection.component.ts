import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CategoryLabelPipe } from '../../../art-history-fields.pipe';
import { EntityCategory } from '../../explore-data.model';
import { ExploreDataService } from '../../explore-data.service';
import { variableUseOptions } from '../explore-selections.constants';

@Component({
  selector: 'app-variable-use-selection',
  standalone: true,
  imports: [CommonModule, CategoryLabelPipe],
  templateUrl: './variable-use-selection.component.html',
  styleUrls: ['./variable-use-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariableUseSelectionComponent implements OnChanges {
  @Input() variable: EntityCategory;
  selectionsVariable: string;
  variableUseOptions = variableUseOptions;

  constructor(public data: ExploreDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variable'] && this.variable) {
      this.selectionsVariable = `${this.variable}Use`;
    }
  }

  updateVariableUse(variableUse: 'filter' | 'disaggregate'): void {
    this.data.updateSelections({
      [this.selectionsVariable]: variableUse,
    });
  }
}
