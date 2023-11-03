import {
    BarsDimensionsConfig,
    HorizontalBarsDimensionsConfig,
    VerticalBarChartDimensionsConfig,
} from '../bars/bars.config';
import {
    CategoricalColorDimensionConfig,
    OrdinalDimensionConfig,
    QuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import { DataMarksConfig } from '../data-marks/data-marks.config';
import { PatternPredicate } from '../shared/pattern-utilities.class';

export class UnitsConfig extends DataMarksConfig {
    ordinal: OrdinalDimensionConfig = new OrdinalDimensionConfig();
    quantitative: QuantitativeDimensionConfig = new QuantitativeDimensionConfig();
    category: CategoricalColorDimensionConfig = new CategoricalColorDimensionConfig();
    dimensions: UnitsDimensionsConfig;
    patternPredicates?: PatternPredicate[];
    unitSize: number;
    unitGroupSize: number;
}

export class UnitsDimensionsConfig extends BarsDimensionsConfig {}
export class VerticalUnitsChartDimensionsConfig extends VerticalBarChartDimensionsConfig {}
export class HorizontalUnitsChartDimensionsConfig extends HorizontalBarsDimensionsConfig {}

export class UnitsQuantitativeDimensionConfig extends QuantitativeDimensionConfig {
    override valueAccessor: never;
}
