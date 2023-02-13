import { SelectionOption } from 'src/app/shared/components/form-components/form-radio-input/form-radio-input.model';
import { FilterType, ValueType } from './explore-selections.model';

export const dataTypeOptions: SelectionOption[] = [
    { label: 'Count', value: ValueType.count },
    { label: 'Percent', value: ValueType.percent },
];

export const filterUseOptions: SelectionOption[] = [
    {
        label: 'Filter',
        value: FilterType.filter,
    },
    {
        label: 'Disaggregate',
        value: FilterType.disaggregate,
    },
];

export const tenureOptions: SelectionOption[] = [
    {
        label: 'All',
        selected: false,
    },
    {
        label: 'Tenure track',
        selected: true,
    },
    {
        label: 'Non-tenure track',
        selected: true,
    },
    {
        label: 'Unknown',
        selected: false,
    },
];

export const rankOptions: SelectionOption[] = [
    {
        label: 'All',
        selected: true,
    },
    {
        label: 'Assistant professor',
        selected: false,
    },
    {
        label: 'Associate professor',
        selected: false,
    },
    {
        label: 'Full professor',
        selected: false,
    },
    {
        label: 'Chair',
        selected: false,
    },
    {
        label: 'Open rank',
        selected: false,
    },
    {
        label: 'Lecturer',
        selected: false,
    },
    {
        label: 'Visiting position',
        selected: false,
    },
    {
        label: 'Unknown',
        selected: false,
    },
];
