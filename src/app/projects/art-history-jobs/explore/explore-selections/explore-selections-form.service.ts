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

  // createForm(
  //   formDefaults: ExploreSelectionsDefaults
  // ): FormGroup<ExploreSelectionsFormGroup> {
  //   const form = new FormGroup({
  //     valueType: new FormControl(formDefaults.valueType),
  //     years: new FormGroup({
  //       start: new FormControl(formDefaults.years.start),
  //       end: new FormControl(formDefaults.years.end),
  //     }),
  //     fields: new FormArray([]),
  //     tenureUse: new FormControl(formDefaults.tenureUse),
  //     tenureFilterValue: new FormControl(formDefaults.tenureFilterValue),
  //     tenureDisaggValues: new FormArray([]),
  //     rankUse: new FormControl(formDefaults.rankUse),
  //     rankFilterValue: new FormControl(formDefaults.rankFilterValue),
  //     rankDisaggValues: new FormArray([]),
  //   });
  //   return form;
  // }

  // initializeFormArray(
  //   formArray: FormArray,
  //   formItems: SelectionOption[]
  // ): void {
  //   formItems.forEach((item) => {
  //     formArray.push(this.fb.control(item.selected));
  //   });
  // }
}
