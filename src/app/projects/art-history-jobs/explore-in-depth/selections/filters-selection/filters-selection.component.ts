import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ButtonOption } from 'src/app/shared/components/button-group/button-group.model';
import {
    rankFilterOptions,
    rankOptions,
    tenureFilterOptions,
    tenureOptions,
} from '../../../art-history-jobs.constants';
import { ArtHistoryJobsService } from '../../../art-history-jobs.service';

@Component({
    selector: 'app-filters-selection',
    templateUrl: './filters-selection.component.html',
    styleUrls: ['./filters-selection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FiltersSelectionComponent implements OnInit {
    tenureFilterOptions: ButtonOption[] = tenureFilterOptions;
    rankFilterOptions: ButtonOption[] = rankFilterOptions;
    tenureOptions: ButtonOption[] = tenureOptions;
    rankOptions: ButtonOption[] = rankOptions;

    constructor(public service: ArtHistoryJobsService) {}

    ngOnInit(): void {}

    tenureIsFilter(): boolean {
        return this.tenureFilterOptions.find((x) => x.value === 'filter').selected;
    }

    rankIsFilter(): boolean {
        return this.rankFilterOptions.find((x) => x.value === 'filter').selected;
    }

    updateTenureFilterSelection(): void {
        console.log('tenure');
        const type = this.tenureIsFilter() ? 'filter' : 'disaggregate';
        const selection = this.tenureFilterOptions.filter((x) => x.selected).map((x) => x.value);
        this.service.updateTenureSelections({ type, selection });
    }

    updateRankFilterSelection(): void {
        const type = this.rankIsFilter() ? 'filter' : 'disaggregate';
        const selection = this.rankFilterOptions.filter((x) => x.selected).map((x) => x.value);
        this.service.updateRankSelections({ type, selection });
    }
}
