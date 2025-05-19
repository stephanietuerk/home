import { safeAssign } from '../core/utilities/safe-assign';
import { PointMarkersOptions } from './point-markers-options';

export class PointMarkers<Datum> implements PointMarkersOptions<Datum> {
  readonly datumClass: (d: Datum, i: number) => string;
  readonly display: (d: Datum) => boolean;
  readonly growByOnHover: number;
  readonly radius: number;

  constructor(options: PointMarkersOptions<Datum>) {
    safeAssign(this, options);
  }
}
