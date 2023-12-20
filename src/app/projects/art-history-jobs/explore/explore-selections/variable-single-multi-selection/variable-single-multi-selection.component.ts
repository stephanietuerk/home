import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { ExploreDataService } from '../../explore-data.service';
import { VariableOption } from '../explore-selections.model';

@Component({
  selector: 'app-variable-single-multi-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variable-single-multi-selection.component.html',
  styleUrls: ['./variable-single-multi-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariableSingleMultiSelectionComponent
  implements OnChanges, OnInit
{
  @Input() variable: 'tenure' | 'rank';
  @Input() options: VariableOption[];
  selectionsUseVariable: string;
  selectionsVariable: string;
  inputType$: Observable<'checkbox' | 'radio'>;

  constructor(public data: ExploreDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variable'] && this.variable) {
      this.selectionsVariable = `${this.variable}Values`;
      this.selectionsUseVariable = `${this.variable}Use`;
    }
  }

  ngOnInit(): void {
    this.inputType$ = this.data.selections$.pipe(
      map((selections) => selections[this.selectionsUseVariable]),
      distinctUntilChanged(),
      map((variableUse) => {
        return variableUse === 'filter' ? 'radio' : 'checkbox';
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
      this.data.updateSelections({
        [this.selectionsVariable]: updatedSelections,
      });
    }
  }
}
