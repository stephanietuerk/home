import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { JobProperty } from '../../../art-history-data.model';
import { EntityCategory } from '../../explore-data.model';
import { ExploreDataService } from '../../explore-data.service';
import { FilterType, VariableOption } from '../explore-selections.model';

@Component({
  selector: 'app-variable-single-multi-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variable-single-multi-selection.component.html',
  styleUrls: ['./variable-single-multi-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class VariableSingleMultiSelectionComponent<T extends VariableOption>
  implements OnChanges, OnInit
{
  @Input() variable: EntityCategory;
  @Input() options: T[];
  selectionsUseVariable: string;
  selectionsVariable: string;
  inputUsesIcon: boolean;
  inputType$: Observable<'checkbox' | 'radio'>;
  JobProperty = JobProperty;
  valueAccessor: 'value' | 'label';

  constructor(public data: ExploreDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variable'] && this.variable) {
      this.valueAccessor =
        this.variable === JobProperty.field ? 'value' : 'label';
      this.selectionsVariable = `${this.variable}Values`;
      this.selectionsUseVariable = `${this.variable}Use`;
      this.inputUsesIcon = this.variable !== JobProperty.field;
    }
  }

  ngOnInit(): void {
    this.inputType$ = this.data.selections$.pipe(
      map((selections) => selections[this.selectionsUseVariable]),
      distinctUntilChanged(),
      map((variableUse) => {
        return variableUse === FilterType.filter ? 'radio' : 'checkbox';
      })
    );
  }

  updateVariableValues(
    value: string,
    inputType: 'checkbox' | 'radio',
    selections: string[]
  ): void {
    if (inputType === 'radio') {
      this.data.updateSelections({ [this.selectionsVariable]: [value] });
    } else {
      let updatedSelections: string[];
      if (selections.includes(value)) {
        updatedSelections = selections.filter((x) => x !== value);
      } else {
        updatedSelections = [...selections, value];
      }
      if (updatedSelections.length === 0) {
        updatedSelections = [this.options[0][this.valueAccessor]];
      }
      this.data.updateSelections({
        [this.selectionsVariable]: updatedSelections,
      });
    }
  }
}
