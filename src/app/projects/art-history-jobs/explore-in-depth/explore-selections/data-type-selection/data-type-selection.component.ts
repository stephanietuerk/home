import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputOption } from 'src/app/shared/components/input-option.model';
import { dataTypeOptions } from '../../../art-history-jobs.constants';
import { ArtHistoryJobsService } from '../../../art-history-jobs.service';

@Component({
    selector: 'app-data-type-selection',
    templateUrl: './data-type-selection.component.html',
    styleUrls: ['../../../styles/art-history-jobs.scss', './data-type-selection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DataTypeSelectionComponent implements OnInit {
    dataTypeOptions: InputOption[] = dataTypeOptions;

    constructor(private service: ArtHistoryJobsService) {}

    ngOnInit(): void {}

    updateDataTypeSelection(selection: string): void {
        this.service.updateDataType(selection);
    }
}
