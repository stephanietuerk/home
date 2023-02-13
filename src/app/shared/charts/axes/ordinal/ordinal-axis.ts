import { AbstractConstructor } from '../../utilities/constructor';
import { XyAxis } from '../xy-axis';

export function mixinOrdinalAxis<T extends AbstractConstructor<XyAxis>>(
  Base: T
) {
  abstract class Mixin extends Base {
    defaultTickSizeOuter = 0;

    setAxis(axisFunction: any): void {
      const tickSizeOuter =
        this.config.tickSizeOuter || this.defaultTickSizeOuter;
      this.axis = axisFunction(this.scale).tickSizeOuter(tickSizeOuter);
    }
  }

  return Mixin;
}
