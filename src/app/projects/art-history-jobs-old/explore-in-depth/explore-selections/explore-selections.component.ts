import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { artHistoryFields, dataTypeOptions, RankType, TenureType } from '../../art-history-jobs.constants';
import { ExploreSelectionsFormService } from './explore-selections-form.service';
import { FilterType, ValueType } from './explore-selections.model';

@Component({
    selector: 'app-explore-selections',
    templateUrl: './explore-selections.component.html',
    styleUrls: ['../../styles/art-history-jobs.scss', './explore-selections.component.scss'],
})
export class ExploreSelectionsComponent implements OnInit {
    @Input() yearsRange: [number, number];
    form: FormGroup;
    dataTypeOptions = dataTypeOptions;
    fieldOptions = artHistoryFields;

    constructor(private formService: ExploreSelectionsFormService) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm(): void {
        this.form = this.formService.createForm({
            dataType: ValueType.count,
            years: {
                start: this.yearsRange[0],
                end: this.yearsRange[1],
            },
            fields: ['All'],
            filters: {
                tenureUse: FilterType.disaggregate,
                tenureValues: [TenureType.true, TenureType.false],
                rankUse: FilterType.filter,
                rankValues: [RankType.all],
            },
        });
    }
}
