import { Component, OnInit } from '@angular/core';
import { artHistoryFields } from '../../../art-history-jobs.constants';
import { ArtHistoryJobsService } from '../../../art-history-jobs.service';
import { AttributeSelection, Field } from '../../../models/art-history-config';

@Component({
    selector: 'app-field-selection',
    templateUrl: './field-selection.component.html',
    styleUrls: ['../../../styles/art-history-jobs.scss', './field-selection.component.scss'],
})
export class FieldSelectionComponent implements OnInit {
    fields: Field[] = artHistoryFields;

    constructor(public service: ArtHistoryJobsService) {}

    ngOnInit(): void {
        this.service.rankSelections.subscribe((rankSelections: AttributeSelection) => {
            if (rankSelections.type === 'disaggregate') {
                this.resetToOneField();
            }
        });
        this.service.tenureSelections.subscribe((tenureSelections: AttributeSelection) => {
            if (tenureSelections.type === 'disaggregate') {
                this.resetToOneField();
            }
        });
    }

    resetToOneField(): void {
        let firstFound = false;
        this.fields.forEach((field: Field) => {
            if (firstFound) {
                field.selected = false;
            } else {
                if (field.selected) {
                    firstFound = true;
                }
            }
        });
    }

    handleFieldSelection(fieldToUpdate: string): void {
        let newField = fieldToUpdate;
        const field = this.fields.find((x) => x.name.full === fieldToUpdate);
        field.selected = !field.selected;
        if (this.fields.filter((x) => x.selected).length === 0) {
            this.fields[0].selected = true;
            newField = this.fields[0].name.full;
        }
        this.service.updateFields([fieldToUpdate]);
    }
}
