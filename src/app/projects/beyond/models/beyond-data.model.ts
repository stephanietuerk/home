import { CensusVariable, ElectionType, ElectionYear } from './beyond-enums.model';

export class TractObject {
    [number: number]: TractDatum;
}

export class TractDatum {
    [ElectionType.president]: MarginsData;
    [ElectionType.senate]: MarginsData;
    [ElectionType.house]: MarginsData;
    [CensusVariable.populationDensity]: DemoData;
    [CensusVariable.nonWhite]: DemoData;
    [CensusVariable.unemployment]: DemoData;
    [CensusVariable.college]: DemoData;
    [CensusVariable.income]: DemoData;
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
