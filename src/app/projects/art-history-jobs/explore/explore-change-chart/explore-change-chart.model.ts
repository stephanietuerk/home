import { AxisConfig } from 'src/app/viz-components/axes/axis.config';
import {
  BarsConfig,
  BarsLabelsConfig,
  HorizontalBarsDimensionsConfig,
} from 'src/app/viz-components/bars/bars.config';
import { TickWrapConfig } from 'src/app/viz-components/svg-text-wrap/tick-wrap.config';

export class ChangeChartConfig extends BarsConfig {
  constructor() {
    super();
    this.dimensions = new HorizontalBarsDimensionsConfig();
    // this.category.colors = [highlightColor];
    this.ordinal.paddingInner = 0.15;
    this.labels = new BarsLabelsConfig();
  }
}

export class ChangeChartYAxisConfig extends AxisConfig {
  constructor() {
    super();
    this.tickSizeOuter = 0;
    this.removeTickMarks = true;
    this.removeDomain = true;
    this.tickLabelFontSize = 14;
    this.wrap = new TickWrapConfig();
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
