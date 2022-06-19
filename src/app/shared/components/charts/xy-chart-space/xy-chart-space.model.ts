import { AxisConfig } from './axis-config.model';

export class ElementSpacing {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class DimensionProperties {
    scale?: any;
    axis?: any;
    axisConfig?: AxisConfig;
}

export interface XYScaleParameters {
    x: [any, any];
    y: [any, any];
}
