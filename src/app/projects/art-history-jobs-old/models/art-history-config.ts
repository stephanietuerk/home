export interface Field {
    name: FieldName;
    color: string;
    selected: boolean;
    sort: number;
}

export interface FieldName {
    full: string;
    short: string;
}

export interface ArtHistorySelections {
    fields: string[];
    dataType: 'percent' | 'count';
    tenure: AttributeSelection;
    rank: AttributeSelection;
    years: YearsSelection;
}

export interface AttributeSelection {
    type: 'filter' | 'disaggregate';
    selection: string[];
}

export interface YearsSelection {
    start: number;
    end: number;
}

export interface LineDef {
    field: string;
    tenure: string;
    rank: string;
}

export interface FormatSpecifications {
    explore: ExploreFormat;
}

export interface ExploreFormat {
    chart: {
        value: ChartFormat;
        tick: ChartFormat;
    };
}

export interface DataValueFormat {
    percent: string;
    integer: string;
    decimal: string;
}

export interface DateFormat {
    year: string;
}

export type ChartFormat = DataValueFormat & DateFormat;
