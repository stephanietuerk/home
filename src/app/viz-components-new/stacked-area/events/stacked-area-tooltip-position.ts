import { ConnectedPosition } from '@angular/cdk/overlay';
import { safeAssign } from '../../core/utilities/safe-assign';

export class VicLinesTooltipPosition implements ConnectedPosition {
  originX: 'start' | 'end' | 'center';
  originY: 'center' | 'bottom' | 'top';
  overlayX: 'start' | 'end' | 'center';
  overlayY: 'center' | 'bottom' | 'top';
  weight?: number;
  offsetX?: number;
  offsetY?: number;
  panelClass?: string | string[];

  constructor(private position?: Partial<ConnectedPosition>) {
    this.originX = 'start';
    this.originY = 'top';
    this.overlayX = 'center';
    this.overlayY = 'bottom';

    if (position) {
      safeAssign(this, position);
    }
  }
}
