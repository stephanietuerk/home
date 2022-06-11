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
