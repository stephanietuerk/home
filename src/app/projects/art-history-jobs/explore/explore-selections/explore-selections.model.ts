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
    lecturer = 'lecturer',
    vap = 'vap',
    unknown = 'unknown',
}

export interface ExploreFormSelections {
    dataType: ValueType.count | ValueType.percent;
    years: ExploreYearsSelection;
    fields: string[];
    tenureUse: FilterType.filter | FilterType.disaggregate;
    tenureFilterValue: string;
    tenureDisaggValues: string[];
    rankUse: FilterType.filter | FilterType.disaggregate;
    rankFilterValue: string;
    rankDisaggValues: string[];
}

export interface ExploreSelections {
    dataType: ValueType.count | ValueType.percent;
    years: ExploreYearsSelection;
    fields: string[];
    tenureUse: FilterType.filter | FilterType.disaggregate;
    tenureValues: string[];
    rankUse: FilterType.filter | FilterType.disaggregate;
    rankValues: string[];
}

export interface ExploreYearsSelection {
    start: number;
    end: number;
}
