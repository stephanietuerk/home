import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ArtHistoryJobsService } from '../../art-history-jobs.service';
import { AttributeSelection, YearsSelection } from '../../models/art-history-config';

@Component({
    selector: 'app-explore-line',
    templateUrl: './explore-line.component.html',
    styleUrls: ['./explore-line.component.scss'],
})
export class ExploreLineComponent implements OnInit {
    constructor(private service: ArtHistoryJobsService) {}

    ngOnInit(): void {
        combineLatest([
            this.service.fields,
            this.service.dataType,
            this.service.tenureSelections,
            this.service.rankSelections,
            this.service.yearsSelection,
        ]).subscribe(
            ([fields, dataType, tenureSelections, rankSelections, yearsSelection]: [
                string[],
                string,
                AttributeSelection,
                AttributeSelection,
                YearsSelection
            ]) => {
                this.filterDataForChart(fields, dataType, tenureSelections, rankSelections, yearsSelection);
            }
        );
    }

    filterDataForChart(
        fields: string[],
        dataType: string,
        tenureSelections: AttributeSelection,
        rankSelections: AttributeSelection,
        yearsSelection: YearsSelection
    ): void {}
}
