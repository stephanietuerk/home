/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortDirection } from 'src/app/core/enums/sort.enum';

export class TableHeader {
  display: string;
  align: string;
  type: string;
  formatter?: (value: any) => string;
  id: string;
  sort: TableSort;
  ariaLabeL?: string;
  classes?: string[];
}

export class TableSort {
  canSort: boolean;
  direction: SortDirection | null;
  firstSort: SortDirection;
}
