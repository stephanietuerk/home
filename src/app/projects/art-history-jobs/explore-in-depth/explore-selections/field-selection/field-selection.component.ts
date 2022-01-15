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
    isDisaggregated: boolean = false;

    constructor(public service: ArtHistoryJobsService) {}

    ngOnInit(): void {
        this.service.rankSelections.subscribe((rankSelections: AttributeSelection) => {
            this.processAttributeSelection(rankSelections);
        });
        this.service.tenureSelections.subscribe((tenureSelections: AttributeSelection) => {
            this.processAttributeSelection(tenureSelections);
        });
    }

    processAttributeSelection(attributeSelection: AttributeSelection): void {
        if (attributeSelection.type === 'filter') {
            this.isDisaggregated = false;
        } else {
            this.isDisaggregated = true;
            this.resetToOneField();
        }
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
        if (this.isDisaggregated) {
            this.selectNewFieldWhenDisaggregated(fieldToUpdate);
        } else {
            this.selectNewField(fieldToUpdate);
        }
    }

    selectNewField(fieldToUpdate: string): void {
        let newField = fieldToUpdate;
        const field = this.fields.find((x) => x.name.full === fieldToUpdate);
        field.selected = !field.selected;
        if (this.fields.filter((x) => x.selected).length === 0) {
            this.fields[0].selected = true;
            newField = this.fields[0].name.full;
        }
        this.service.updateFields([fieldToUpdate]);
    }

    selectNewFieldWhenDisaggregated(fieldToUpdate: string): void {
        this.unselectSelectedFields();
        this.selectNewField(fieldToUpdate);
    }

    unselectSelectedFields(): void {
        const selectedFields = this.fields.filter((x) => x.selected);
        selectedFields.forEach((field: Field) => {
            field.selected = false;
        });
        this.service.updateFields(selectedFields.map((x) => x.name.full));
    }
}
