import { curveLinear, scaleLinear, scaleUtc, schemeTableau10, Series, stackOffsetNone, stackOrderNone } from 'd3';
import { CategoricalColorDimension, QuantitativeDimension } from '../data-marks/data-dimension.model';
import { DataMarksConfig } from '../data-marks/data-marks.model';

export class StackedAreaConfig extends DataMarksConfig {
    x: QuantitativeDimension = new QuantitativeDimension();
    y: QuantitativeDimension = new QuantitativeDimension();
    category: CategoricalColorDimension = new CategoricalColorDimension();
    valueIsDefined?: (...args: any) => any;
    curve: (x: any) => any;
    offset: (series: Series<any, any>, order: Iterable<number>) => void;
    order: (x: any) => any;
    keyOrder?: string[];

    constructor() {
        super();
        this.x.valueAccessor = ([x]) => x;
        this.x.scaleType = scaleUtc;
        this.y.valueAccessor = ([, y]) => y;
        this.y.scaleType = scaleLinear;
        this.category.valueAccessor = () => 1;
        this.category.colors = schemeTableau10 as string[];
        this.curve = curveLinear;
        this.order = stackOrderNone;
        this.offset = stackOffsetNone;
    }
}
