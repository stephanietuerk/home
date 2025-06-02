import { safeAssign } from '../core/utilities/safe-assign';
import { StrokeBase } from './base/stroke-base';
import { StrokeOptions } from './stroke-options';

export class Stroke extends StrokeBase implements StrokeOptions {
  readonly color: string;

  constructor(options: Partial<StrokeOptions>) {
    super();
    safeAssign(this, options);
  }
}
