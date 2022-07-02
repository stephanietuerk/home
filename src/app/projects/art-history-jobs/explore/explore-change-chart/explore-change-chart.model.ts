import { BarsConfig, horizontalBarChartDimensionsConfig } from 'src/app/shared/components/charts/bars/bars.model';
import {
    OrdinalAxisConfig,
    QuantitativeAxisConfig,
    TickWrap,
} from 'src/app/shared/components/charts/xy-chart-space/axis-config.model';

export class ChangeChartConfig extends BarsConfig {
    constructor() {
        super();
        this.dimensions = horizontalBarChartDimensionsConfig;
        // this.category.colors = [highlightColor];
        this.ordinal.paddingInner = 0.15;
        this.labels.show = true;
    }
}

export class ChangeChartYAxisConfig extends OrdinalAxisConfig {
    constructor() {
        super();
        this.tickSizeOuter = 0;
        this.removeTickMarks = true;
        this.removeDomain = true;
        this.tickLabelFontSize = 14;
        this.wrap = new TickWrap();
        this.wrap.maintainXPosition = true;
        this.wrap.maintainYPosition = true;
        this.wrap.lineHeight = 0.9;
    }
}

export class ChangeChartXAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.numTicks = 5;
    }
}
