import { curveLinear, scaleLinear, scaleUtc } from 'd3';

export class LineChartOptions {
    x: LineChartXAxisDimension;
    y: LineChartYAxisDimension;
    category: LineChartCategoryDimension;
    valueIsDefined?: (...args: any) => any;
    width: number;
    height: number;
    margin: any;
    curve: (x: any) => any;
    transitionDuration: number;
    background?: LineChartBackground;
    showTooltip?: boolean;
    usePointMarker?: boolean;
    stroke?: LineChartStroke;
    labelLines?: boolean;
    mixBlendMode?: string;
    tooltipFormat?: string;
    pointMarkerRadius?: number;
    lineLabelsFormat?: (d: string) => string;

    constructor() {
        this.width = 800;
        this.height = 600;
        this.margin = {
            top: 36,
            right: 36,
            bottom: 36,
            left: 36,
        };
        this.x = {
            valueAccessor: ([x]) => x,
            scaleType: scaleUtc,
            axis: {
                show: true,
                side: 'bottom',
            },
        };
        this.y = {
            valueAccessor: ([, y]) => y,
            scaleType: scaleLinear,
            axis: {
                show: true,
                side: 'left',
            },
        };
        this.category = {
            valueAccessor: () => 1,
        };
        this.curve = curveLinear;
        this.stroke = {
            width: 2,
        };
        this.transitionDuration = 250;
        this.lineLabelsFormat = (d: string) => d;
    }
}

export interface LineChartDimension {
    valueAccessor: (any) => any;
}

export interface LineChartAxisDimension extends LineChartDimension {
    scaleType?: (d: any, r: any) => any;
    domain?: [any, any];
    range?: [number, number];
    valueFormat?: string;
}

export interface LineChartXAxisDimension extends LineChartAxisDimension {
    axis: LineChartXAxisConfig;
}

export interface LineChartYAxisDimension extends LineChartAxisDimension {
    axis: LineChartYAxisConfig;
}

export interface LineChartAxisConfig {
    show: boolean;
    removeDomain?: boolean;
    removeTicks?: boolean;
    showGridLines?: boolean;
    numTicks?: number;
}
export interface LineChartXAxisConfig extends LineChartAxisConfig {
    side?: 'top' | 'bottom';
}

export interface LineChartYAxisConfig extends LineChartAxisConfig {
    side?: 'left' | 'right';
    label?: string;
}

export interface LineChartCategoryDimension extends LineChartDimension {
    domain?: any[];
    colorScale?: (...args: any) => any;
    colors?: string[];
}

export interface LineChartStroke {
    linecap?: string;
    linejoin?: string;
    width?: number;
    opacity?: number;
}

export interface LineChartBackground {
    show: boolean;
    color: string;
}
