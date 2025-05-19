import { DataValue } from '../../core/types/values';
import { FillDefinition } from '../../data-dimensions';
import { NumberChartPositionDimension } from '../../data-dimensions/continuous-quantitative/number-chart-position/number-chart-position';
import { OrdinalChartPositionDimension } from '../../data-dimensions/ordinal/ordinal-chart-position/ordinal-chart-position';
import { OrdinalVisualValueDimension } from '../../data-dimensions/ordinal/ordinal-visual-value/ordinal-visual-value';
import { DataMarksOptions } from '../../marks/config/marks-options';
import { BarsBackgrounds } from './backgrounds/bars-backgrounds';
import { BarsLabels } from './labels/bars-labels';

export interface BarsOptions<Datum, OrdinalDomain extends DataValue>
  extends DataMarksOptions<Datum> {
  backgrounds: BarsBackgrounds;
  color: OrdinalVisualValueDimension<Datum, string, string>;
  customFills: FillDefinition<Datum>[];
  ordinal: OrdinalChartPositionDimension<Datum, OrdinalDomain>;
  quantitative: NumberChartPositionDimension<Datum>;
  labels: BarsLabels<Datum>;
}
