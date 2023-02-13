import { curveLinear, scaleLinear, scaleUtc, schemeTableau10, Series, stackOffsetNone, stackOrderNone } from 'd3';
import {
    CategoricalColorDimensionConfig,
    QuantitativeDimensionConfig,
} from 'src/app/shared/charts/data-marks/data-dimension.config';
import { DataMarksConfig } from '../data-marks/data-marks.model';

export class StackedAreaConfig extends DataMarksConfig {
    // x: QuantitativeDimension = new QuantitativeDimension();
    // y: QuantitativeDimension = new QuantitativeDimension();
    // category: CategoricalColorDimension = new CategoricalColorDimension();
    // valueIsDefined?: (...args: any) => any;
    // curve: (x: any) => any;
    // offset: (series: Series<any, any>, order: Iterable<number>) => void;
    // order: (x: any) => any;
    // keyOrder?: string[];

    // constructor() {
    //     super();
    //     this.x.valueAccessor = ([x]) => x;
    //     this.x.scaleType = scaleUtc;
    //     this.y.valueAccessor = ([, y]) => y;
    //     this.y.scaleType = scaleLinear;
    //     this.category.valueAccessor = () => 1;
    //     this.category.colors = schemeTableau10 as string[];
    //     this.curve = curveLinear;
    //     this.order = stackOrderNone;
    //     this.offset = stackOffsetNone;
    // }
    x: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
    y: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
    category: CategoricalColorDimensionConfig = new CategoricalColorDimensionConfig();
    valueIsDefined?: (...args: any) => any;
    curve: (x: any) => any;
    stackOffsetFunction: (series: Series<any, any>, order: Iterable<number>) => void;
    stackOrderFunction: (x: any) => any;
    categoryOrder?: string[];

    constructor(init?: Partial<StackedAreaConfig>) {
        super();
        this.x.valueAccessor = ([x]) => x;
        this.x.scaleType = scaleUtc;
        this.y.valueAccessor = ([, y]) => y;
        this.y.scaleType = scaleLinear;
        this.category.valueAccessor = () => 1;
        this.category.colors = schemeTableau10 as string[];
        this.curve = curveLinear;
        this.stackOrderFunction = stackOrderNone;
        this.stackOffsetFunction = stackOffsetNone;
        Object.assign(this, init);
    }
}
