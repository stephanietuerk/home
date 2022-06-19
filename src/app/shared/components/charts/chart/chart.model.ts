export class ChartConfig {
    width: number;
    height: number;
    scaleChartWithContainer: boolean;
    hasHoverEvents: boolean;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface Ranges {
    x: [number, number];
    y: [number, number];
}
