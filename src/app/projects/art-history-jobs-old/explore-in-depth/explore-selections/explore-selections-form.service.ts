import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExploreSelections } from './explore-selections.model';

@Injectable({
    providedIn: 'root',
})
export class ExploreSelectionsFormService {
    constructor(private fb: FormBuilder) {}

    createForm(formDefaults: ExploreSelections): FormGroup {
        return this.fb.group({
            dataType: [formDefaults.dataType],
            years: this.fb.group({
                start: [formDefaults.years.start],
                end: [formDefaults.years.end],
            }),
            fields: [formDefaults.fields],
            filters: this.fb.group({
                tenureUse: [formDefaults.filters.tenureUse],
                tenureValue: [formDefaults.filters.tenureValues],
                rankUse: [formDefaults.filters.rankUse],
                rankValue: [formDefaults.filters.rankValues],
            }),
        });
    }
}
