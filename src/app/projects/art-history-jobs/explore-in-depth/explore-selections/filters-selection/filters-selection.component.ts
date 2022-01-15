import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputOption } from 'src/app/shared/components/input-option.model';
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
    tenureUseOptions: InputOption[] = tenureFilterOptions;
    tenureOptions: InputOption[] = tenureOptions;
    isTenureFilter: boolean;
    rankUseOptions: InputOption[] = rankFilterOptions;
    rankOptions: InputOption[] = rankOptions;
    isRankFilter: boolean;

    constructor(public service: ArtHistoryJobsService) {}

    ngOnInit(): void {
        this.setIsTenureFilter();
        this.setIsRankFilter();
    }

    setIsTenureFilter(): void {
        this.isTenureFilter = this.isFilterSelected(this.tenureUseOptions);
    }

    setIsRankFilter(): void {
        this.isRankFilter = this.isFilterSelected(this.rankUseOptions);
    }

    isFilterSelected(options: InputOption[]): boolean {
        return options.find((x) => x.value === 'filter').selected;
    }

    updateTenureUseSelection() {
        this.setIsTenureFilter();
        if (this.isTenureFilter && this.tenureOptions.filter((o) => o.selected).length > 1) {
            this.tenureOptions = tenureOptions;
        }
    }

    updateRankUseSelection() {
        this.setIsRankFilter();
        if (this.isRankFilter && this.rankOptions.filter((o) => o.selected).length > 1) {
            this.rankOptions = rankOptions;
        }
    }

    onNewTenureSelection(): void {
        const type = this.isTenureFilter ? 'filter' : 'disaggregate';
        const selection = this.tenureOptions.filter((x) => x.selected).map((x) => x.value);
        this.service.updateTenureSelections({ type, selection });
    }

    onNewRankSelection(): void {
        const type = this.isRankFilter ? 'filter' : 'disaggregate';
        const selection = this.rankOptions.filter((x) => x.selected).map((x) => x.value);
        this.service.updateRankSelections({ type, selection });
    }
}
