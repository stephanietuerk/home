import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SelectionOption } from 'src/app/shared/components/form-components/form-radio-input/form-radio-input.model';
import { ExploreFormSelections } from './explore-selections.model';

@Injectable({
    providedIn: 'root',
})
export class ExploreSelectionsFormService {
    constructor(private fb: FormBuilder) {}

    createForm(formDefaults: ExploreFormSelections): FormGroup {
        const form = this.fb.group({
            dataType: [formDefaults.dataType],
            years: this.fb.group({
                start: [formDefaults.years.start],
                end: [formDefaults.years.end],
            }),
            fields: new FormArray([]),
            tenureUse: [formDefaults.tenureUse],
            tenureFilterValue: [formDefaults.tenureFilterValue],
            tenureDisaggValues: new FormArray([]),
            rankUse: [formDefaults.rankUse],
            rankFilterValue: [formDefaults.rankFilterValue],
            rankDisaggValues: new FormArray([]),
        });
        return form;
    }

    initializeFormArray(formArray: FormArray, formItems: SelectionOption[]): void {
        formItems.forEach((item) => {
            formArray.push(this.fb.control(item.selected));
        });
    }
}
