import { rankOptions, tenureOptions } from '../../art-history-fields.constants';
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
    label: 'Filter',
    value: FilterType.filter,
  },
  {
    label: 'Disaggregate',
    value: FilterType.disaggregate,
  },
];

export const fieldsUseOptions: VariableUseOption[] = [
  {
    label: 'Explore within a field',
    value: FilterType.filter,
  },
  {
    label: 'Compare across fields',
    value: FilterType.disaggregate,
  },
];

export const tenureValueOptions: VariableOption[] = [
  { label: 'All', value: 'all' },
  ...tenureOptions,
];

export const rankValueOptions: VariableOption[] = [
  { label: 'All', value: 'all' },
  ...rankOptions,
];
