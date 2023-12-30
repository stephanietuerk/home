import { JobDatum, JobProperty } from '../art-history-data.model';
import { ValueType } from './explore-selections/explore-selections.model';

export interface ExploreChartsData {
  timeRange: ExploreTimeRangeChartData;
  change: ExploreChangeChartData;
}

export interface ExploreTimeRangeChartData {
  data: JobDatum[];
  dataType: ValueType.count | ValueType.percent;
  categories: EntityCategory;
}

export interface ExploreChangeChartData {
  data: JobDatum[];
  dataType: ValueType.count | ValueType.percent;
  categories: EntityCategory;
}

export type EntityCategory =
  | JobProperty.field
  | JobProperty.tenure
  | JobProperty.rank;

export interface ExploreChangeDatum extends JobDatum {
  [JobProperty.year]: never;
  startValue: number;
  endValue: number;
}
