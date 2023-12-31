/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import {
  ConnectedOverlayConfig,
  GlobalOverlayConfig,
  OverlayService,
} from '../overlay/overlay.service';
import { ConnectedMessageComponent } from './connected-message/connected-message.component';
import { GlobalMessageComponent } from './global-message/global-message.component';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService, OverlayService],
    });
    service = TestBed.inject(MessageService);
  });

  describe('createGlobalMessage', () => {
    beforeEach(() => {
      spyOn(service as any, 'initializeMessageComponent');
    });
    it('calls initializeMessageComponent once with the correct params', () => {
      service.createGlobalMessage(['hi'], new GlobalOverlayConfig());
      expect((service as any).initializeMessageComponent).toHaveBeenCalledTimes(
        1
      );
      expect((service as any).initializeMessageComponent).toHaveBeenCalledWith(
        GlobalMessageComponent,
        ['hi'],
        new GlobalOverlayConfig()
      );
    });
  });

  describe('createConnectedMessage', () => {
    beforeEach(() => {
      spyOn(service as any, 'initializeMessageComponent');
    });
    it('calls initializeMessageComponent once with the correct params', () => {
      service.createConnectedMessage(['hi'], new ConnectedOverlayConfig());
      expect((service as any).initializeMessageComponent).toHaveBeenCalledTimes(
        1
      );
      expect((service as any).initializeMessageComponent).toHaveBeenCalledWith(
        ConnectedMessageComponent,
        ['hi'],
        new ConnectedOverlayConfig()
      );
    });
  });
});
