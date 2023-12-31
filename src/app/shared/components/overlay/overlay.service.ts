import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
  OverlaySizeConfig,
  PositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';
import { appName } from 'src/app/core/constants/app.constants';

export const belowLeftAligned: ConnectedPosition = {
  originX: 'start',
  originY: 'bottom',
  overlayX: 'start',
  overlayY: 'top',
};

export const belowRightAligned: ConnectedPosition = {
  originX: 'end',
  originY: 'bottom',
  overlayX: 'end',
  overlayY: 'top',
};

export const belowCenterAligned: ConnectedPosition = {
  originX: 'center',
  originY: 'bottom',
  overlayX: 'center',
  overlayY: 'top',
};

export const aboveLeftAligned: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'start',
  overlayY: 'bottom',
};

export const aboveRightAligned: ConnectedPosition = {
  originX: 'end',
  originY: 'top',
  overlayX: 'end',
  overlayY: 'bottom',
};

export const aboveCenterAligned: ConnectedPosition = {
  originX: 'center',
  originY: 'top',
  overlayX: 'center',
  overlayY: 'bottom',
};

class ScorecardOverlayConfig {
  /**
   * The CSS class to apply to the Angular Material CDK backdrop element. Default value is `${appName}-overlay-backdrop`.
   */
  backdropClass: string;
  /**
   * Whether the overlay has a backdrop.
   */
  hasBackdrop: boolean;
  /**
   * Whether the overlay should be disposed of when the user goes backwards/forwards in history. Note that this doesn't include clicking on links.
   */
  disposeOnNavigation: boolean;
  /**
   * Custom class to add to the Angular Material CDK overlay panel. Default value is `${appName}-overlay-panel`.
   */
  panelClass: string | string[];
  /**
   * Strategy to be used when handling scroll events while the overlay is open. Default value is noop.
   */
  scrollStrategy: 'reposition' | 'block' | 'close' | 'noop';
  /**
   * The element that the overlay will connect to.
   */
  connectedElementRef: ElementRef;
  /**
   * An array of positions, in order of preference, that control how the overlay is positioned relative to the origin.
   */
  positions: ConnectedPosition[];
  /**
   * The size of the overlay panel relative to the entire viewport. If the size is not provided, it will be determined by the overlay's content.
   */
  size: OverlaySizeConfig;
  /**
   * Number of milliseconds after which the overlay will close. If not present, the overlay will not close automatically.
   */
  closeAfter: number;

  constructor() {
    this.backdropClass = `${appName}-overlay-backdrop`;
    this.hasBackdrop = true;
    this.disposeOnNavigation = true;
    this.panelClass = `${appName}-overlay-panel`;
    this.scrollStrategy = 'noop';
    this.closeAfter = 0;
  }
}

export class ConnectedOverlayConfig extends ScorecardOverlayConfig {
  constructor(init?: Partial<ConnectedOverlayConfig>) {
    super();
    this.positions = [aboveCenterAligned];
    Object.assign(this, init);
  }
}

export class GlobalOverlayConfig extends ScorecardOverlayConfig {
  override connectedElementRef: never;
  override positions: never;

  constructor(init?: Partial<GlobalOverlayConfig>) {
    super();
    Object.assign(this, init);
  }
}

@Injectable()
export class OverlayService {
  overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {}

  getOverlayConfig(
    _config: ConnectedOverlayConfig | GlobalOverlayConfig
  ): OverlayConfig {
    const config = new OverlayConfig();
    config.backdropClass = _config.backdropClass;
    config.hasBackdrop = _config.hasBackdrop;
    config.disposeOnNavigation = _config.disposeOnNavigation;
    config.panelClass = _config.panelClass;
    if (_config.size) {
      config.height = _config.size.height;
      config.maxHeight = _config.size.maxHeight;
      config.maxWidth = _config.size.maxWidth;
      config.minHeight = _config.size.minHeight;
      config.minWidth = _config.size.minWidth;
      config.width = _config.size.width;
    }
    if (_config.connectedElementRef) {
      config.positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(_config.connectedElementRef)
        .withPositions(_config.positions);
    } else {
      config.positionStrategy = this.overlayPositionBuilder.global();
    }
    switch (_config.scrollStrategy) {
      case 'reposition':
        config.scrollStrategy = this.overlay.scrollStrategies.reposition();
        break;
      case 'block':
        config.scrollStrategy = this.overlay.scrollStrategies.block();
        break;
      case 'close':
        config.scrollStrategy = this.overlay.scrollStrategies.close();
        break;
      case 'noop':
        config.scrollStrategy = this.overlay.scrollStrategies.noop();
        break;
      default:
        config.scrollStrategy = this.overlay.scrollStrategies.noop();
        break;
    }
    return config;
  }

  createOverlay(config: OverlayConfig): void {
    this.overlayRef = this.overlay.create(config);
  }

  attachComponent<T>(component: ComponentType<T>, injector?: Injector): T {
    const componentRef = this.overlayRef.attach(
      new ComponentPortal(component, null, injector)
    );
    return componentRef.instance;
  }

  updateGlobalPosition(x: number, y: number): void {
    const strategy = this.getGlobalPositionStrategy(x, y);
    this.overlayRef.updatePositionStrategy(strategy);
  }

  getGlobalPositionStrategy(x: number, y: number): PositionStrategy {
    return this.overlayPositionBuilder.global().left(`${x}px`).top(`${y}px`);
  }

  detachOverlay(): void {
    this.overlayRef.detach();
  }

  destroyOverlay(): void {
    this.overlayRef.dispose();
    this.overlayRef = undefined;
  }
}
