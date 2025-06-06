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

export type EntityCategory = 'field' | 'rank' | 'tenure';

export interface ExploreChangeDatum extends JobDatum {
  [JobProperty.year]: never;
  startValue: number;
  endValue: number;
}

export interface ExploreChartTitle {
  valueType: string;
  fields: string;
  tenureAndRank: string;
  disaggregation: string;
}
