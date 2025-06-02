import { safeAssign } from '../../core/utilities/safe-assign';
import { AxisBaselineOptions } from './axis-baseline-options';

export class AxisBaseline implements AxisBaselineOptions {
  readonly display: boolean;
  readonly zeroBaseline: { display: boolean; dasharray: string };

  constructor(options: AxisBaselineOptions) {
    safeAssign(this, options);
  }
}
