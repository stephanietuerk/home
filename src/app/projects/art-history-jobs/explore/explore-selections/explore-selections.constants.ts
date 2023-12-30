import {
  artHistoryFields,
  rankOptions,
  tenureOptions,
} from '../../art-history-fields.constants';
import {
  FilterType,
  ValueType,
  ValueTypeOption,
  VariableOption,
  VariableUseOption,
} from './explore-selections.model';

export const valueTypeOptions: ValueTypeOption[] = [
  { label: 'Count', value: ValueType.count },
  { label: 'Percent', value: ValueType.percent },
];

export const variableUseOptions: VariableUseOption[] = [
  {
    label: 'Explore within a ',
    value: FilterType.filter,
  },
  {
    label: 'Compare across ',
    value: FilterType.disaggregate,
  },
];

export const fieldUseOptions: VariableUseOption[] = [
  {
    label: 'Explore within a field',
    value: FilterType.filter,
  },
  {
    label: 'Compare across fields',
    value: FilterType.disaggregate,
  },
];

export const fieldValueOptions: VariableOption[] = artHistoryFields.map((x) => {
  return { label: x.name.short, value: x.name.full, color: x.color };
});

export const tenureValueOptions: VariableOption[] = [
  { label: 'All', value: 'all' },
  ...tenureOptions,
];

export const rankValueOptions: VariableOption[] = [
  { label: 'All', value: 'all' },
  ...rankOptions,
];
