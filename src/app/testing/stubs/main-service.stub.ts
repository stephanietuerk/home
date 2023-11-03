import { ActivatedRouteStub } from './angular/activated-route.stub';
import { RouterStub } from './angular/router.stub';
import { BeyondServiceStub } from './beyond.service.stub';

export class MainServiceStub {
  activatedRouteStub = new ActivatedRouteStub();
  beyondServiceStub = new BeyondServiceStub();
  routerStub = new RouterStub();
}
