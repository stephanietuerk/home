import { curveLinear, scaleLinear, scaleUtc, schemeTableau10 } from 'd3';
import { CategoricalColorDimension, QuantitativeDimension } from '../data-marks/data-dimension.model';
import { DataMarksConfig } from '../data-marks/data-marks.model';

export class LinesConfig extends DataMarksConfig {
    x: QuantitativeDimension = new QuantitativeDimension();
    y: QuantitativeDimension = new QuantitativeDimension();
    category: CategoricalColorDimension = new CategoricalColorDimension();
    valueIsDefined?: (...args: any) => any;
    curve: (x: any) => any;
    pointMarker: PointMarker = new PointMarker();
    stroke?: LinesStroke = new LinesStroke();
    lineLabels: LineLabels = new LineLabels();
    tooltipDetectionRadius: number;

    constructor() {
        super();
        this.x.valueAccessor = ([x]) => x;
        this.x.scaleType = scaleUtc;
        this.y.valueAccessor = ([, y]) => y;
        this.y.scaleType = scaleLinear;
        this.category.valueAccessor = () => 1;
        this.category.colors = schemeTableau10 as string[];
        this.curve = curveLinear;
        this.stroke.width = 2;
        this.tooltipDetectionRadius = 80;
    }
}

export class LinesStroke {
    linecap?: string;
    linejoin?: string;
    width?: number;
    opacity?: number;
}

export class PointMarker {
    display: boolean;
    radius: number;
    growByOnHover: number;

    constructor() {
        this.display = false;
        this.radius = 3;
        this.growByOnHover = 1;
    }
}

export class LinesTooltipData {
    datum: any;
    color: string;
    x: string;
    y: string;
    category: string;
}

export interface Marker {
    key: string;
    index: number;
}

export class LineLabels {
    show: boolean;
    align: 'inside' | 'outside';
    format: (d: string) => string;

    constructor() {
        this.format = (d: string) => d;
        this.align = 'outside';
    }
}
