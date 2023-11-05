import { BehaviorSubject } from 'rxjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ActivatedRouteStub {
  snapshot: any;
  queryParamMap = new BehaviorSubject(null);
}
