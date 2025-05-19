import { DataValue } from '../../../../../../core/types/values';
import { DataDimensionOptions } from '../../../../../../data-dimensions/dimension-options';

export interface AttributeDataDimensionOptions<
  Datum,
  AttributeValue extends DataValue,
  RangeValue extends string | number = string,
> extends DataDimensionOptions<Datum, AttributeValue> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolator: (...args: any) => any;
  nullColor: string;
  range: RangeValue[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: (...args: any) => string;
}
