import { XyAxisElement } from 'src/app/shared/charts/xy-chart-space/xy-axis.class';

export class XyAxisElementStub extends XyAxisElement {
  setAxisFunction() {
    return;
  }
  initNumTicks(): number {
    return 10;
  }
  subscribeToScale(): void {
    return;
  }
  getAxisFunction(): any {
    return {};
  }
  setTranslate(): void {
    return;
  }
}
