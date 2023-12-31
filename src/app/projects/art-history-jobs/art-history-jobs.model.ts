export interface ArtHistoryFormatSpecifications {
  summary: SummaryFormat;
  explore: ExploreFormat;
}

export interface SummaryFormat {
  chart: {
    value: SummaryChartFormat;
    tick: SummaryChartFormat;
  };
  table: {
    avg: string;
    current: string;
  };
}

export interface SummaryChartFormat {
  year: string;
  count: string;
}

export interface ExploreFormat {
  chart: {
    value: ExploreChartFormat;
    tick: ExploreChartFormat;
  };
}

export interface DataValueFormat {
  percent: string;
  count: string;
  decimal: string;
}

export interface DateFormat {
  year: string;
}

export type ExploreChartFormat = DataValueFormat & DateFormat;
