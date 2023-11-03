/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject } from 'rxjs';

export class RouterStub {
  url: string;
  navigate = jasmine.createSpy('navigate');
  nextEvent: any;
  events = new Subject();
  constructor() {
    this.events.next(this.nextEvent);
  }
}
