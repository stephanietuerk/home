import { DemoVariable, ElectionType, ElectionYear } from './beyond-enums.model';

export class TractObject {
    [number: number]: TractDatum;
}

export class TractDatum {
    [ElectionType.president]: MarginsData;
    [ElectionType.senate]: MarginsData;
    [ElectionType.house]: MarginsData;
    [DemoVariable.populationDensity]: DemoData;
    [DemoVariable.nonWhite]: DemoData;
    [DemoVariable.unemployment]: DemoData;
    [DemoVariable.college]: DemoData;
    [DemoVariable.income]: DemoData;
}

export class MarginsData {
    [ElectionYear._2012]: number;
    [ElectionYear._2016]: number;
    [ElectionYear.change]: number;
}

export class DemoData {
    current: number;
    change: number | 'N/A';
}
