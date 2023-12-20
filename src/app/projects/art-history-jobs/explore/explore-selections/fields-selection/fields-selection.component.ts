import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { artHistoryFields } from '../../../art-history-fields.constants';
import { ExploreDataService } from '../../explore-data.service';
import { FilterType, VariableOption } from '../explore-selections.model';

@Component({
  selector: 'app-fields-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fields-selection.component.html',
  styleUrls: ['./fields-selection.component.scss'],
})
export class FieldsSelectionComponent implements OnInit {
  fieldOptions: (VariableOption & { color: string })[] = artHistoryFields.map(
    (x) => {
      return { label: x.name.short, value: x.name.full, color: x.color };
    }
  );
  inputType$: Observable<'checkbox' | 'radio'>;

  constructor(public data: ExploreDataService) {}

  ngOnInit(): void {
    this.inputType$ = this.data.selections$.pipe(
      map((selections) => {
        return {
          tenureUse: selections.tenureUse,
          rankUse: selections.rankUse,
        };
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      map((selections) => {
        const fieldsCanBeMulti =
          selections.tenureUse === FilterType.filter &&
          selections.rankUse === FilterType.filter;
        return fieldsCanBeMulti ? 'checkbox' : 'radio';
      })
    );
  }

  updateField(
    field: string,
    inputType: 'checkbox' | 'radio',
    currentSelections: string[]
  ): void {
    if (inputType === 'radio') {
      this.data.updateSelections({ fields: [field] });
    } else {
      let updatedSelections: string[];
      if (currentSelections.includes(field)) {
        updatedSelections = currentSelections.filter((x) => x !== field);
      } else {
        updatedSelections = [...currentSelections, field];
      }
      this.data.updateSelections({ fields: updatedSelections });
    }
  }
}
