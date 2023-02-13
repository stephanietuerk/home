import { curveLinear, scaleLinear, scaleUtc, schemeTableau10 } from 'd3';
import { CategoricalColorDimensionConfig, QuantitativeDimensionConfig } from '../data-marks/data-dimension.config';
import { DataMarksConfig, TooltipConfig } from '../data-marks/data-marks.config';

export class LinesConfig extends DataMarksConfig {
    x: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
    y: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
    category: CategoricalColorDimensionConfig = new CategoricalColorDimensionConfig();
    valueIsDefined?: (...args: any) => any;
    curve: (x: any) => any;
    pointMarker: PointMarkerConfig = new PointMarkerConfig();
    stroke?: LinesStrokeConfig = new LinesStrokeConfig();
    lineLabels: LineLabelsConfig = new LineLabelsConfig();

    constructor(init?: Partial<LinesConfig>) {
        super();
        this.x.valueAccessor = ([x]) => x;
        this.x.scaleType = scaleUtc;
        this.y.valueAccessor = ([, y]) => y;
        this.y.scaleType = scaleLinear;
        this.category.valueAccessor = () => 1;
        this.category.colors = schemeTableau10 as string[];
        this.curve = curveLinear;
        this.stroke.width = 2;
        Object.assign(this, init);
    }
}

export class LinesTooltipConfig extends TooltipConfig {
    detectionRadius: number;

    constructor(init?: Partial<LinesTooltipConfig>) {
        super();
        this.detectionRadius = 80;
        Object.assign(this, init);
    }
}

export class LinesStrokeConfig {
    linecap?: string;
    linejoin?: string;
    width?: number;
    opacity?: number;
    constructor(init?: Partial<LinesStrokeConfig>) {
        Object.assign(this, init);
    }
}

export class PointMarkerConfig {
    display: boolean;
    radius: number;
    growByOnHover: number;

    constructor(init?: Partial<PointMarkerConfig>) {
        this.display = true;
        this.radius = 3;
        this.growByOnHover = 1;
        Object.assign(this, init);
    }
}

export class LineLabelsConfig {
    display: boolean;
    align: 'inside' | 'outside';
    format: (d: string) => string;

    constructor() {
        this.display = false;
        this.format = (d: string) => d;
        this.align = 'outside';
    }
}
