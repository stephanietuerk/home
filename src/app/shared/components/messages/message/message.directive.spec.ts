import { fakeAsync, tick } from '@angular/core/testing';
import { Message } from './message.directive';

class ConcreteMessage extends Message {}

describe('MessageDirective', () => {
  let directive: ConcreteMessage;
  beforeEach(() => {
    directive = new ConcreteMessage();
  });

  describe('ngAfterViewInit', () => {
    beforeEach(() => {
      directive.close = jasmine.createSpy('close');
    });
    it('should call close after closeAfter time if closeAfter is defined', fakeAsync(() => {
      directive.closeAfter = 1000;
      directive.ngAfterViewInit();
      tick(1001);
      expect(directive.close).toHaveBeenCalledTimes(1);
    }));
    it('should not call close if closeTime is undefined', fakeAsync(() => {
      directive.ngAfterViewInit();
      tick(1001);
      expect(directive.close).not.toHaveBeenCalled();
    }));
  });

  describe('onClose', () => {
    it('calls close', () => {
      directive.close = jasmine.createSpy('close');
      directive.onClose();
      expect(directive.close).toHaveBeenCalledTimes(1);
    });
  });
});
