import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Sort } from 'src/app/core/enums/sort.enum';
import { SortService } from 'src/app/core/services/sort.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { TableSort } from 'src/app/shared/components/table/table.model';

@Component({
    selector: 'app-art-history-table',
    templateUrl: '../../../../shared/components/table/table.component.html',
    styleUrls: ['../../../../shared/components/table/table.component.scss', './art-history-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArtHistoryTableComponent extends TableComponent implements OnInit {
    @Output() sortedFields = new EventEmitter<void>();

    constructor(public sortService: SortService) {
        super(sortService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    sortRows(sort: TableSort, dataProperty: string): void {
        if (sort.direction) {
            this.rows.sort((a, b) =>
                this.sortService.valueCompare(sort.direction === Sort.asc, a[dataProperty], b[dataProperty])
            );
            this.sortedFields.emit(null);
        }
    }
}
