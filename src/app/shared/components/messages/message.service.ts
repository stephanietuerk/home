import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';

import {
  ConnectedOverlayConfig,
  GlobalOverlayConfig,
  OverlayService,
} from '../overlay/overlay.service';
import { ConnectedMessageComponent } from './connected-message/connected-message.component';
import { GlobalMessageComponent } from './global-message/global-message.component';
import { Message } from './message/message.directive';

@Injectable()
/**
 * A service that creates message popups using either the GlobalMessageComponent or the RelativeMessageComponent
 * Uses the OverlayService to create and manage the overlay
 * Must be provided locally
 * @see OverlayService
 */
export class MessageService {
  constructor(private overlay: OverlayService) {}

  /**
   * Creates a message popup that will be displayed in a globally positioned overlay
   * @param message Strings that will be displayed as sequential <p> elements
   * @param config A config object that establishes the behavior of the popup
   * @see GlobalMessageComponent
   */
  createGlobalMessage(
    message: string[],
    config: Partial<GlobalOverlayConfig> = {}
  ): GlobalMessageComponent {
    const scorecardOverlayConfig = new GlobalOverlayConfig(config);
    const component = this.initializeMessageComponent(
      GlobalMessageComponent,
      message,
      scorecardOverlayConfig
    );
    return component;
  }

  /**
   * Creates a message popup that will be displayed in a relatively positioned overlay
   * @param message Strings that will be displayed as sequential <p> elements
   * @param config A config object that establishes the behavior of the popup
   * @see ConnectedMessageComponent
   */
  createConnectedMessage(
    message: string[],
    config: Partial<ConnectedOverlayConfig>
  ): ConnectedMessageComponent {
    const scorecardOverlayConfig = new ConnectedOverlayConfig(config);
    const component = this.initializeMessageComponent(
      ConnectedMessageComponent,
      message,
      scorecardOverlayConfig
    );
    return component;
  }

  private initializeMessageComponent<T extends Message>(
    component: ComponentType<T>,
    message: string[],
    config: ConnectedOverlayConfig | GlobalOverlayConfig
  ): T {
    const overlayConfig = this.overlay.getOverlayConfig(config);
    this.overlay.createOverlay(overlayConfig);
    const messageComponent = this.overlay.attachComponent(component);
    messageComponent.message = message;
    if (config.closeAfter) {
      messageComponent.closeAfter = config.closeAfter;
    }
    messageComponent.close = () => {
      this.overlay.detachOverlay();
      this.overlay.destroyOverlay();
    };
    return messageComponent;
  }
}
