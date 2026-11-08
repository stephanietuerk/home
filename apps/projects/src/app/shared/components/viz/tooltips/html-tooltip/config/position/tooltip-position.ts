import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  OverlayPositionBuilder,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { safeAssign } from '../../../../core/utilities/safe-assign';
import { HtmlTooltipOffsetFromOriginPositionOptions } from './tooltip-position-options';

export abstract class HtmlTooltipPosition {
  type: 'connected' | 'global';
  strategy: GlobalPositionStrategy | FlexibleConnectedPositionStrategy;

  abstract getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder
  ): PositionStrategy;
}

export class HtmlTooltipCdkManagedPosition extends HtmlTooltipPosition {
  positions: ConnectedPosition[];

  constructor(positions: ConnectedPosition[]) {
    super();
    this.type = 'connected';
    this.positions = positions;
  }

  getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder
  ): PositionStrategy {
    return overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions(this.positions);
  }
}

export class HtmlTooltipOffsetFromOriginPosition
  extends HtmlTooltipPosition
  implements HtmlTooltipOffsetFromOriginPositionOptions
{
  offsetY: number;
  offsetX: number;
  tooltipOriginX: 'center';
  tooltipOriginY: 'bottom';

  constructor(options: HtmlTooltipOffsetFromOriginPositionOptions) {
    super();
    this.type = 'global';
    this.tooltipOriginX = 'center';
    this.tooltipOriginY = 'bottom';
    safeAssign(this, options);
  }

  getPositionStrategy(
    origin: Element,
    overlayPositionBuilder: OverlayPositionBuilder
  ): PositionStrategy {
    const rect = origin.getBoundingClientRect();
    return overlayPositionBuilder
      .global()
      .left(`${rect.left + this.offsetX}px`)
      .top(`${rect.top + this.offsetY}px`);
  }
}
