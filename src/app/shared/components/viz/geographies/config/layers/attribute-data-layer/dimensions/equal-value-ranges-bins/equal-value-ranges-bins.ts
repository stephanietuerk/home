import { extent } from 'd3';
import { safeAssign } from '../../../../../../core/utilities/safe-assign';
import { BinStrategy } from '../attribute-data-bin-enums';
import { CalculatedBinsAttributeDataDimension } from '../calculated-bins/calculated-bins';
import { EqualValueRangesAttributeDataDimensionOptions } from './equal-value-ranges-bins-options';

/**
 * Configuration object for attribute data that is quantitative and will be binned into equal value ranges. For example, if the data is [0, 1, 2, 4, 60, 100] and numBins is 2, the bin ranges will be [0, 49] and [50, 100].
 *
 * The generic parameter is the type of the attribute data.
 */
export class EqualValueRangesAttributeDataDimension<
    Datum,
    RangeValue extends string | number = string,
  >
  extends CalculatedBinsAttributeDataDimension<Datum, RangeValue>
  implements EqualValueRangesAttributeDataDimensionOptions<Datum, RangeValue>
{
  override readonly binType: BinStrategy.equalValueRanges;
  private calculatedDomain: [number, number];
  readonly domain: [number, number];
  readonly numBins: number;

  constructor(
    options: EqualValueRangesAttributeDataDimensionOptions<Datum, RangeValue>
  ) {
    super('number');
    this.binType = BinStrategy.equalValueRanges;
    safeAssign(this, options);
    if (!this.valueAccessor) {
      console.error(
        'Value accessor is required for EqualValuesAttributeDataDimension'
      );
    }
  }

  setPropertiesFromData(data: Datum[]): void {
    const values = data.map(this.valueAccessor);
    this.setDomain(values);
    this.setValidatedDomainAndNumBins();
    this.setRange();
  }

  protected setDomain(values: number[]): void {
    const domainValues = this.domain ?? values;
    this.calculatedDomain = extent(domainValues);
  }

  private setValidatedDomainAndNumBins(): void {
    if (this.valueFormatIsInteger()) {
      const validated = this.getValidatedNumBinsAndDomainForIntegerValues(
        this.numBins,
        this.calculatedDomain
      );
      this.calculatedNumBins = validated.numBins;
      this.calculatedDomain = validated.domain;
    } else {
      this.calculatedNumBins = this.numBins;
    }
  }

  protected valueFormatIsInteger(): boolean {
    return this.formatSpecifier && this.formatSpecifier.includes('0f');
  }

  protected getValidatedNumBinsAndDomainForIntegerValues(
    numBins: number,
    domain: [number, number]
  ): {
    numBins: number;
    domain: [number, number];
  } {
    const validated = { numBins, domain };
    const dataRange = domain.map((x) => Math.round(x));
    const numDiscreteValues = Math.abs(dataRange[1] - dataRange[0]) + 1;
    if (numDiscreteValues < numBins) {
      validated.numBins = numDiscreteValues;
      validated.domain = [dataRange[0], dataRange[1] + 1];
    }
    return validated;
  }

  getScale() {
    return this.scale()
      .domain(this.calculatedDomain)
      .range(this.range)
      .unknown(this.nullColor);
  }
}
