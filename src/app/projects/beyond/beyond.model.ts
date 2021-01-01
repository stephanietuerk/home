export class TractData {
    tract: string;
    usc: MarginsData;
    uss: MarginsData;
    usp: MarginsData;
    popDensity: DemoData;
    nonWhite: DemoData;
    unemployment: DemoData;
    college: DemoData;
    income: DemoData;
}

export class MarginsData {
    _2012: number;
    _2016: number;
    change: number;
}

export class DemoData {
    current: number;
    change: number | 'N/A';
}
