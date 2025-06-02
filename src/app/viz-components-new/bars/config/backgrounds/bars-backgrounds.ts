import { safeAssign } from '../../../core/utilities/safe-assign';
import { BarsBackgroundsOptions } from './bars-backgrounds-options';

export class BarsBackgrounds {
  readonly color: string;
  readonly events: boolean;

  constructor(options: BarsBackgroundsOptions) {
    safeAssign(this, options);
  }
}
