import { SelectionOption } from 'src/app/shared/components/form-components/form-radio-input/form-radio-input.model';
import { FilterType, RankType, TenureType, ValueType } from './explore-selections.model';

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
        value: TenureType.all,
        selected: false,
    },
    {
        label: 'Tenure track',
        value: TenureType.true,
        selected: true,
    },
    {
        label: 'Non-tenure track',
        value: TenureType.false,
        selected: true,
    },
    {
        label: 'Unknown',
        value: TenureType.unknown,
        selected: false,
    },
];

export const rankOptions: SelectionOption[] = [
    {
        label: 'All',
        value: RankType.all,
        selected: true,
    },
    {
        label: 'Assistant professor',
        value: RankType.assistant_prof,
        selected: false,
    },
    {
        label: 'Associate professor',
        value: RankType.associate_prof,
        selected: false,
    },
    {
        label: 'Full professor',
        value: RankType.full_prof,
        selected: false,
    },
    {
        label: 'Open rank',
        value: RankType.open_rank,
        selected: false,
    },
    {
        label: 'Lecturer',
        value: RankType.lecturer,
        selected: false,
    },
    {
        label: 'Visiting position',
        value: RankType.vap,
        selected: false,
    },
    {
        label: 'Unknown',
        value: RankType.unknown,
        selected: false,
    },
];
