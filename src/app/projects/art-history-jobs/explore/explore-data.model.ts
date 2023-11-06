import {
  JobDatumChangeChart,
  JobDatumTimeRangeChart,
} from '../art-history-data.model';
import { ValueType } from './explore-selections/explore-selections.model';

export interface ExploreChartsData {
  timeRange: ExploreTimeRangeChartData;
  change: ExploreChangeChartData;
}

export interface ExploreTimeRangeChartData {
  data: JobDatumTimeRangeChart[];
  dataType: ValueType.count | ValueType.percent;
  categories: LineCategoryType;
}

export interface ExploreChangeChartData {
  data: JobDatumChangeChart[];
  dataType: ValueType.count | ValueType.percent;
  categories: LineCategoryType;
}

export type LineCategoryType = 'field' | 'isTt' | 'rank';
