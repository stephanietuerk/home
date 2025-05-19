import { safeAssign } from '../../core/utilities/safe-assign';

export class Tooltip {
  show: boolean;
  type: 'svg' | 'html';

  constructor(options?: Partial<Tooltip>) {
    this.show = false;
    safeAssign(this, options);
  }
}
