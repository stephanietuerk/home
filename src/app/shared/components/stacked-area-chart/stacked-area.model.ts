import { curveLinear, scaleLinear, scaleUtc, schemeTableau10, Series, stackOffsetNone, stackOrderNone } from 'd3';
import { ElementSpacing } from 'src/app/core/models/charts.model';

export interface StackedAreaConfig {
    el: HTMLElement;
    data: any[];
    options?: StackedAreaOptions;
}

export interface StackedAreaOptions {
    x?: (any) => any;
    y?: (any) => any;
    z?: (any) => any;
    width?: number;
    height?: number;
    margin?: ElementSpacing;
    xScaleType?: (d: any, r: any) => any;
    xDomain?: [any, any];
    xRange?: [number, number];
    yScaleType?: (d: any, r: any) => any;
    yDomain?: [any, any];
    yRange?: [number, number];
    zDomain?: any;
    offset?: (series: Series<any, any>, order: Iterable<number>) => void;
    order?: (x: any) => any;
    curve?: (x: any) => any;
    keyOrder?: string[];
    xFormat?: string;
    yFormat?: string;
    yLabel?: string;
    colors?: string[];
    colorScale?: (d: any) => any;
    showTooltip?: boolean;
    tooltipFormat?: string;
}

export class StackedAreaChartOptions {
    x: (any) => any = ([x]) => x;
    y: (any) => any = ([, y]) => y;
    z: (any) => any = () => 1;
    width: number = 800;
    height: number = 600;
    margin: ElementSpacing = {
        top: 36,
        right: 36,
        bottom: 36,
        left: 36,
    };
    xScaleType: (d: any, r: any) => any = scaleUtc;
    xDomain?: [any, any];
    xRange?: [number, number];
    yScaleType: (d: any, r: any) => any = scaleLinear;
    yDomain?: [any, any];
    yRange?: [number, number];
    zDomain?: any;
    offset: (series: Series<any, any>, order: Iterable<number>) => void = stackOffsetNone;
    order: (x: any) => any = stackOrderNone;
    curve: (x: any) => any = curveLinear;
    xFormat?: string;
    yFormat?: string;
    yLabel?: string;
    colors: string[] = schemeTableau10 as string[];
    colorScale?: (d: any) => any;

    constructor() {
        this.xRange = [this.margin.left, this.width - this.margin.right];
        this.yRange = [this.height - this.margin.bottom, this.margin.top];
    }
}
