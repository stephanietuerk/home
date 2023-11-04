import { ActivatedRouteStub } from './angular/activated-route.stub';
import { AngularFirestoreStub } from './angular/firestore.stub';
import { RouterStub } from './angular/router.stub';
import { BeyondServiceStub } from './beyond.service.stub';
import { EnvironmentServiceStub } from './environment.service.stub';

export class MainServiceStub {
  activatedRouteStub = new ActivatedRouteStub();
  angularFirestoreStub = new AngularFirestoreStub();
  beyondServiceStub = new BeyondServiceStub();
  environmentServiceStub = new EnvironmentServiceStub();
  routerStub = new RouterStub();
}
