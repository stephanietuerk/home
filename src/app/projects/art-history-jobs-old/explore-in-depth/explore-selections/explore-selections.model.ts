export enum ValueType {
    count = 'count',
    percent = 'percent',
}

export enum FilterType {
    filter = 'filter',
    disaggregate = 'disaggregate',
}

export interface ExploreSelections {
    dataType: ValueType.count | ValueType.percent;
    years: ExploreYearsSelection;
    fields: string[];
    filters: ExploreSelectionsFilters;
}

export interface ExploreYearsSelection {
    start: number;
    end: number;
}

export interface ExploreSelectionsFilters {
    tenureUse: FilterType.filter | FilterType.disaggregate;
    tenureValues: string[];
    rankUse: FilterType.filter | FilterType.disaggregate;
    rankValues: string[];
}
