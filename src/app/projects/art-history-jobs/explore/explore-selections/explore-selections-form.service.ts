import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterType, ValueType } from './explore-selections.model';

export interface ExploreSelectionsFormGroup {
  valueType: FormControl<keyof typeof ValueType>;
  years: FormGroup<YearsFormGroup>;
  fields: FormArray<FormControl<boolean>>;
  tenureUse: FormControl<FilterType.disaggregate | FilterType.filter>;
  tenureFilterValue: FormControl<string>;
  tenureDisaggValues: FormArray<FormControl<boolean>>;
  rankUse: FormControl<FilterType.disaggregate | FilterType.filter>;
  rankFilterValue: FormControl<string>;
  rankDisaggValues: FormArray<FormControl<boolean>>;
}

export interface YearsFormGroup {
  start: FormControl<number>;
  end: FormControl<number>;
}

@Injectable({
  providedIn: 'root',
})
export class ExploreSelectionsFormService {
  constructor(private fb: FormBuilder) {}
}
