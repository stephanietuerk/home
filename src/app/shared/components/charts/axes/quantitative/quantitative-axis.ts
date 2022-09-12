import { format, timeFormat, TimeInterval } from 'd3';
import { AbstractConstructor } from '../../utilities/constructor';

import { XyAxis } from '../xy-axis';

export function mixinQuantitativeAxis<T extends AbstractConstructor<XyAxis>>(
  Base: T
) {
  abstract class Mixin extends Base {
    defaultTickFormat = ',.1f';

    setAxis(axisFunction: any): void {
      const tickFormat = this.config.tickFormat || this.defaultTickFormat;

      this.axis = axisFunction(this.scale);
      this.setTicks(tickFormat);
    }

    private setTicks(tickFormat: string): void {
      if (this.config.tickValues) {
        this.setSpecifiedTickValues(tickFormat);
      } else {
        this.setUnspecifiedTickValues(tickFormat);
      }
    }

    private setSpecifiedTickValues(tickFormat: string): void {
      this.axis.tickValues(this.config.tickValues).tickFormat((d) => {
        const formatter = d instanceof Date ? timeFormat : format;
        return formatter(tickFormat)(d);
      });
    }

    private setUnspecifiedTickValues(tickFormat: string): void {
      const validatedNumTicks = this.getValidatedNumTicks(tickFormat);
      this.axis.ticks(validatedNumTicks, tickFormat);
    }

    private getValidatedNumTicks(tickFormat: string): number | TimeInterval {
      let numTicks = this.config.numTicks || this.initNumTicks();

      if (this.ticksAreIntegers(tickFormat)) {
        const [start, end] = this.scale.domain();
        if (numTicks > end - start) {
          numTicks = end - start;
        }
      }

      return numTicks;
    }

    private ticksAreIntegers(tickFormat: string): boolean {
      return tickFormat.includes('0f');
    }
  }

  return Mixin;
}
