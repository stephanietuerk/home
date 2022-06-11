import { InternSet, scaleBand } from 'd3';

export class DataDimension {
    valueAccessor: (...args: any) => any;
    domain?: any;
    range?: any;
    valueFormat?: string;
}

export class QuantitativeDimension extends DataDimension {
    override domain?: [any, any];
    scaleType?: (d: any, r: any) => any;

    constructor() {
        super();
    }
}

export class CategoricalColorDimension extends DataDimension {
    override domain?: any[] | InternSet;
    colorScale?: (...args: any) => any;
    colors?: string[];
}

export class OrdinalDimension extends DataDimension {
    override domain?: any[] | InternSet;
    scaleType: (d: any, r: any) => any;
    paddingInner: number;
    paddingOuter: number;
    align: number;

    constructor() {
        super();
        this.scaleType = scaleBand;
        this.paddingInner = 0.1;
        this.paddingOuter = 0.1;
        this.align = 0.5;
    }
}
