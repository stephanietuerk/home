import { SortDirection } from 'src/app/core/enums/sort.enum';

export class TableHeader {
    display: string;
    align: string;
    type: string;
    formatter?: (value: any) => string;
    id: string;
    sort: TableSort;
}

export class TableSort {
    canSort: boolean;
    direction?: SortDirection | null;
}
