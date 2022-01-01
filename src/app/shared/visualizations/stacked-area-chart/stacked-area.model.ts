import { Series } from 'd3';
import { ElementSpacing } from '../charts.model';

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
    xFormat?: string;
    yFormat?: string;
    yLabel?: string;
    colors?: string[];
    colorScale?: (d: any) => any;
}
