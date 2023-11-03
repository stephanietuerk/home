import { DataMarks } from './data-marks';

export class OrdinalQuantitativeDataMarks extends DataMarks {
    setValueArrays: () => void;
    subscribeToScales: () => void;
    subscribeToRanges: () => void;
    values: OrdinalDataMarksValues;
    ordinalScale: (d: any) => any;
    quantitativeScale: (d: any) => any;
}

export class OrdinalDataMarksValues {
    ordinal: any[];
    category: any[];
    indicies: any[];
}
