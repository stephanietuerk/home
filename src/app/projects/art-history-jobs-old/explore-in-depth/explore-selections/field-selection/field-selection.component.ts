import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
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
        combineLatest([this.service.rankSelections, this.service.tenureSelections]).subscribe(
            ([rankSelections, tenureSelections]: [AttributeSelection, AttributeSelection]) => {
                this.processAttributeSelections(rankSelections, tenureSelections);
            }
        );
    }

    processAttributeSelections(rankSelections: AttributeSelection, tenureSelections: AttributeSelection): void {
        if (rankSelections.type === 'filter' && tenureSelections.type === 'filter') {
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

    handleFieldSelection(fieldToUpdate: Field): void {
        if (this.isDisaggregated) {
            this.unselectSelectedFields();
        }
        this.selectNewField(fieldToUpdate);
    }

    unselectSelectedFields(): void {
        const selectedFields = this.getSelectedFields();
        selectedFields.forEach((field: Field) => {
            field.selected = false;
        });
    }

    selectNewField(fieldToUpdate: Field): void {
        fieldToUpdate.selected = !fieldToUpdate.selected;
        if (this.fields.filter((x) => x.selected).length === 0) {
            this.fields[0].selected = true;
        }
        this.updateFieldsSelection();
    }

    getSelectedFields(): Field[] {
        return this.fields.filter((x) => x.selected);
    }

    updateFieldsSelection(): void {
        const selectedFieldNames = this.getSelectedFields().map((x) => x.name.full);
        this.service.updateFields(selectedFieldNames);
    }
}
