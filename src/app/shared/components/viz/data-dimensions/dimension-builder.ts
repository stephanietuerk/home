import { DataValue } from '../core/types/values';

export abstract class DataDimensionBuilder<
  Datum,
  TDataValue extends DataValue,
> {
  protected _formatFunction: (d: Datum) => string;
  protected _valueAccessor: (d: Datum) => TDataValue;

  /**
   * OPTIONAL. Sets a function that will be applied to the value of this dimension for display purposes.
   *
   * If provided, this function will be used instead of the format specifier (available only for quantitative dimensions)
   */
  formatFunction(formatFunction: null): this;
  formatFunction(formatFunction: (d: Datum) => string): this;
  formatFunction(formatFunction: ((d: Datum) => string) | null): this {
    if (formatFunction === null) {
      this._formatFunction = undefined;
      return this;
    }
    this._formatFunction = formatFunction;
    return this;
  }

  /**
   * Sets a user-provided method that extracts the value for this dimension from a datum.
   *
   * REQUIRED. for quantitative dimensions.
   *
   * OPTIONAL. for categorical and ordinal dimensions, though if not provided, the properties of those dimensions cannot reflect the data values.
   */
  valueAccessor(valueAccessor: (d: Datum) => TDataValue): this {
    this._valueAccessor = valueAccessor;
    return this;
  }

  protected validateValueAccessor(dimensionName: string): void {
    if (!this._valueAccessor) {
      throw new Error(
        `${dimensionName} Dimension: valueAccessor is required. Please use method 'valueAccessor' to set it.`
      );
    }
  }
}
