import { HoverEventDirective } from '../../events/hover-event';

export class HoverEventDirectiveStub extends HoverEventDirective {
  setListenedElements(): void {
    return;
  }
  elementPointerEnter(event: PointerEvent): void {
    return;
  }
  elementPointerLeave(event: PointerEvent): void {
    return;
  }
  setElements(): void {
    return;
  }
}
