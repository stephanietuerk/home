export interface JobDatum {
    year: number | Date;
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
