import { AxisConfig } from 'src/app/shared/charts/axes/axis.config';
import { BarsConfig, horizontalBarChartDimensionsConfig } from 'src/app/shared/charts/bars/bars.config';
import { TickWrap } from 'src/app/shared/components/charts_old/axes/axis-config.model';

export class ChangeChartConfig extends BarsConfig {
    constructor() {
        super();
        this.dimensions = horizontalBarChartDimensionsConfig;
        // this.category.colors = [highlightColor];
        this.ordinal.paddingInner = 0.15;
        this.labels.show = true;
    }
}

export class ChangeChartYAxisConfig extends AxisConfig {
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

export class ChangeChartXAxisConfig extends AxisConfig {
    constructor() {
        super();
        this.numTicks = 5;
    }
}
