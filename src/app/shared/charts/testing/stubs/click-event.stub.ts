import { ClickEventDirective } from '../../events/click-event';

export class ClickEventDirectiveStub extends ClickEventDirective {
  setListenedElements(): void {
    return;
  }
  setElements(): void {
    return;
  }
  chartClick(event: Event): void {
    return;
  }
}
