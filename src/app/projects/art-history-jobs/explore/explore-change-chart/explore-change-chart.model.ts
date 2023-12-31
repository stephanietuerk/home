import { VicAxisConfig } from 'src/app/viz-components/axes/axis.config';
import {
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicHorizontalBarsDimensionsConfig,
} from 'src/app/viz-components/bars/bars.config';
import { TickWrapConfig } from 'src/app/viz-components/svg-text-wrap/tick-wrap.config';

export class ChangeChartConfig extends VicBarsConfig {
  categoryLabelsAboveBars: boolean;
  barHeight: number;
  constructor() {
    super();
    this.dimensions = new VicHorizontalBarsDimensionsConfig();
    // this.category.colors = [highlightColor];
    this.ordinal.paddingInner = 0.15;
    this.labels = new VicBarsLabelsConfig();
    this.barHeight = 36;
  }
}

export class ChangeChartYAxisConfig extends VicAxisConfig {
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

export class ChangeChartXAxisConfig extends VicAxisConfig {
  constructor() {
    super();
    this.numTicks = 5;
    this.removeDomain = false;
  }
}
