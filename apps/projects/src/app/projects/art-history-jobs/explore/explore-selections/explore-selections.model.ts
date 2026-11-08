export enum Selection {
  fields,
  valuetype,
  timerange,
  filters,
}

export type SelectionType = keyof typeof Selection;

export enum ValueType {
  count = 'count',
  percent = 'percent',
}

export enum FilterType {
  filter = 'filter',
  disaggregate = 'disaggregate',
}

export enum TenureType {
  all = 'all',
  true = 'true',
  false = 'false',
  unknown = 'unknown',
}

export enum RankType {
  all = 'all',
  assistant_prof = 'assistant_prof',
  associate_prof = 'associate_prof',
  full_prof = 'full_prof',
  open_rank = 'open_rank',
  chair = 'chair',
  lecturer = 'lecturer',
  vap = 'vap',
  unknown = 'unknown',
}

export interface ExploreFormSelections {
  dataType: ValueType.count | ValueType.percent;
  years: Partial<ExploreYearsSelection>;
  fields: boolean[];
  tenureUse: FilterType.filter | FilterType.disaggregate;
  tenureFilterValue: string;
  tenureDisaggValues: boolean[];
  rankUse: FilterType.filter | FilterType.disaggregate;
  rankFilterValue: string;
  rankDisaggValues: boolean[];
}

export interface ExploreSelections {
  valueType: keyof typeof ValueType;
  years: ExploreYearsSelection;
  fieldValues: string[];
  fieldUse: keyof typeof FilterType;
  tenureUse: keyof typeof FilterType;
  tenureValues: string[];
  rankUse: keyof typeof FilterType;
  rankValues: string[];
  changeIsAverage: boolean;
}

export interface ExploreYearsSelection {
  start: number;
  end: number;
}

export interface ValueTypeOption {
  label: string;
  value: keyof typeof ValueType;
}

export interface VariableUseOption {
  label: string;
  value: keyof typeof FilterType;
}

export interface VariableOption {
  label: string;
  value: string;
  color?: string;
}

export type FieldUse = 'single' | 'multi';

export interface FieldUseOption {
  label: string;
  value: FieldUse;
}
