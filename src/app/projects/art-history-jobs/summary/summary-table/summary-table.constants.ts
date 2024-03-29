import { format } from 'd3';
import { TableHeader } from 'src/app/shared/components/table/table.model';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';

export const tableHeaders: TableHeader[] = [
  {
    display: 'Field',
    align: 'left',
    id: 'field',
    type: 'string',
    sort: {
      canSort: true,
      direction: null,
      firstSort: 'asc',
    },
  },
  {
    display: 'Avg',
    align: 'right',
    id: 'avg',
    type: 'number',
    formatter: (x) =>
      format(artHistoryFormatSpecifications.summary.table.avg)(x),
    sort: {
      canSort: true,
      direction: 'desc',
      firstSort: 'desc',
    },
  },
  {
    display: '2023',
    align: 'right',
    id: 'current',
    type: 'number',
    formatter: (x) =>
      format(artHistoryFormatSpecifications.summary.table.current)(x),
    sort: {
      canSort: true,
      direction: null,
      firstSort: 'desc',
    },
  },
];
