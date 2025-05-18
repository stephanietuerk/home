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

export enum ExploreSelection {
  fields = 'fields',
  tenure = 'tenure',
  rank = 'rank',
  dataType = 'dataType',
  timeRange = 'timeRange',
}

export const valueTypeOptions: ValueTypeOption[] = [
  { label: 'Count', value: ValueType.count },
  { label: 'Percent', value: ValueType.percent },
];

export const variableUseOptions: VariableUseOption[] = [
  {
    label: 'Compare across ',
    value: FilterType.disaggregate,
  },
  {
    label: 'Explore within a ',
    value: FilterType.filter,
  },
];

export const fieldUseOptions: VariableUseOption[] = [
  {
    label: 'Compare across fields',
    value: FilterType.disaggregate,
  },
  {
    label: 'Explore within a field',
    value: FilterType.filter,
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

export const exploreSelections = {
  label: 'Refine displayed data',
  selections: [
    { label: 'Fields', value: ExploreSelection.fields },
    { label: 'Tenure', value: ExploreSelection.tenure },
    { label: 'Rank', value: ExploreSelection.rank },
    { label: 'Value type', value: ExploreSelection.dataType },
    { label: 'Time range', value: ExploreSelection.timeRange },
  ],
};
