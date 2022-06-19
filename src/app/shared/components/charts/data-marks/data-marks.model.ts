import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';

export class DataMarksComponent extends UnsubscribeDirective {
    config: DataMarksConfig = new DataMarksConfig();
    ranges: Ranges;
    subscribeToScales: () => void;
    setMethodsFromConfigAndDraw: () => void;
    resizeMarks: (ranges: Ranges) => void;
    drawMarks: (transitionDuration: number) => void;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
}

export class DataMarksConfig {
    data: any[];
    transitionDuration: number;
    mixBlendMode: string;
    showTooltip?: boolean;

    constructor() {
        this.transitionDuration = 250;
        this.mixBlendMode = 'normal';
    }
}

export class XYDataMarksComponent extends DataMarksComponent {
    xScale: (x: any) => number;
    yScale: (x: any) => number;
    setValueArrays: () => void;
    subscribeToRanges: () => void;
}

export class XYDataMarksValues {
    x: any[];
    y: any[];
    category: any[];
    indicies: any[];
}

export interface Ranges {
    x: [number, number];
    y: [number, number];
}
