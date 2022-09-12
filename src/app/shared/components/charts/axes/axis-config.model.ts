import { TimeInterval } from 'd3';
import { SvgWrapOptions } from '../utilities/svg-utilities.model';

export class AxisConfig {
  dimensionType: 'quantitative' | 'ordinal';
  tickFormat?: string;
  numTicks?: number | TimeInterval;
  tickValues?: any[];
  removeDomain?: boolean;
  removeTicks?: boolean;
  removeTickMarks?: boolean;
  showGridLines?: boolean;
  wrap?: TickWrap;
  tickSizeOuter?: number;
  tickLabelFontSize?: number;
}

export class TickWrap extends SvgWrapOptions {
  wrapWidth: 'bandwidth' | number;
  override width: never;
}
