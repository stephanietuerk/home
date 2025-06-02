/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, of } from 'rxjs';
import { XyAxis, XyAxisScale } from '../../axes/base/xy-axis-base';
import { Ticks } from '../../axes/ticks/ticks';
import { DataValue } from '../../core/types/values';

export class XyAxisStub<
  T extends DataValue,
  TicksConfig extends Ticks<T>,
> extends XyAxis<T, TicksConfig> {
  getBaselineTranslate(): string | null {
    return null;
  }

  createLabel(): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTicks(tickFormat: string | ((value: T) => string)): void {
    return;
  }
  setScale(): void {
    return;
  }
  getScale(): Observable<XyAxisScale> {
    return of({ scale: 'scale', useTransition: false } as any);
  }
  setAxisFunction() {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAxis(axisFunction: any): void {
    return;
  }
  initNumTicks(): number {
    return 10;
  }
  getAxisFunction(): any {
    return {};
  }
  setTranslate(): void {
    return;
  }
}
