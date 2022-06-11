export interface JobDatum {
    year: Date;
    field: string;
    isTt: string;
    rank: string[];
    count: number;
    percent?: number;
}

export interface JobTableDatum {
    field: string;
    avg: number;
    current: number;
}

export interface LineDef {
    field: string;
    isTt: string;
    rank: string;
}
