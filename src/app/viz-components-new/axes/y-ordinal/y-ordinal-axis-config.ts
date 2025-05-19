import { DataValue } from '../../core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { safeAssign } from '../../core/utilities/safe-assign';
import { XyAxisConfig } from '../base/config/xy-axis-config';
import {
  VicOrdinalAxisOptions,
  mixinOrdinalAxisConfig,
} from '../ordinal/ordinal-axis-config';
import { Ticks } from '../ticks/ticks';
import { YAxisOptions, mixinYAxisConfig } from '../y/y-axis-config';

type XyAxisConfigType<T extends DataValue> = AbstractConstructor<
  XyAxisConfig<T, Ticks<T>>
>;

const AbstractYOrdinalAxis = mixinYAxisConfig<
  DataValue,
  Ticks<DataValue>,
  XyAxisConfigType<DataValue>
>(mixinOrdinalAxisConfig<DataValue, XyAxisConfigType<DataValue>>(XyAxisConfig));

export class VicYOrdinalAxisConfig<
  Tick extends DataValue,
> extends AbstractYOrdinalAxis {
  constructor(options: YAxisOptions & VicOrdinalAxisOptions<Tick>) {
    super();
    safeAssign(this, options);
  }
}
