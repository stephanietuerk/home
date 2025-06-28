import { safeAssign } from '../../../core/utilities/safe-assign';
import { BarsLabelsOptions } from './bars-labels-options';

export class BarsLabels<Datum> implements BarsLabelsOptions<Datum> {
  color: { default: string; withinBarAlternative: string };
  display: boolean;
  noValueFunction: (d: Datum) => string;
  offset: number;

  constructor(options: BarsLabels<Datum>) {
    safeAssign(this, options);
  }
}
