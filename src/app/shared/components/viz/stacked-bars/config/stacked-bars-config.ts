import { InternMap, Series, extent, range, rollup, stack } from 'd3';
import { BarsConfig } from '../../bars/config/bars-config';
import { BarsDimensions } from '../../bars/config/bars-dimensions';
import { DataValue } from '../../core/types/values';
import { StackDatum } from '../stacked-bars.component';
import { StackedBarsOptions } from './stacked-bars-options';

export class StackedBarsConfig<Datum, TOrdinalValue extends DataValue>
  extends BarsConfig<Datum, TOrdinalValue>
  implements StackedBarsOptions<Datum, TOrdinalValue>
{
  stackOffset: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: Series<any, any>,
    order: Iterable<number>
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stackOrder: (x: any) => any;
  stackedData: StackDatum[][];

  constructor(
    dimensions: BarsDimensions,
    options: StackedBarsOptions<Datum, TOrdinalValue>
  ) {
    super(dimensions, options);
  }

  override initPropertiesFromData(): void {
    // parent class will call this method during this class's super call
    // if statement ensures that code in this method is only called at the end of this class's constructor
    if (this.stackOffset !== undefined && this.stackOrder !== undefined) {
      this.setDimensionPropertiesFromData();
      this.setValueIndices();
      this.setHasNegativeValues();
      this.constructStackedData();
      this.initQuantitativeDomainFromStack();
    }
  }

  override setValueIndices(): void {
    this.valueIndices = range(this.ordinal.values.length).filter((i) => {
      return (
        this.ordinal.domainIncludes(this.ordinal.values[i]) &&
        this.color.domainIncludes(this.color.values[i])
      );
    });
  }

  constructStackedData(): void {
    const stackedData = stack<[unknown, InternMap<string, number>]>()
      .keys(this.color.calculatedDomain)
      .value((d, key) => {
        return this.quantitative.values[d[1].get(key)];
      })
      .order(this.stackOrder)
      .offset(this.stackOffset)(
      rollup(
        this.valueIndices,
        ([i]) => i,
        (i) => this.ordinal.values[i],
        (i) => this.color.values[i]
      )
    );

    this.stackedData = stackedData.map((series) =>
      series.map((d) => {
        Object.assign(d, {
          i: d.data[1].get(series.key),
        });
        return d as unknown as StackDatum;
      })
    );
  }

  initQuantitativeDomainFromStack(): void {
    const extents = extent(this.stackedData.flat(2));
    this.quantitative.setDomain(extents);
  }
}
