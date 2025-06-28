/**
 * Enum that defines the types of binning that can be used to map quantitative attribute data to colors.
 */
export enum BinStrategy {
  none = 'none',
  categorical = 'categorical',
  equalValueRanges = 'equalValueRanges',
  equalFrequencies = 'equalFrequencies',
  customBreaks = 'customBreaks',
}
