import { scaleLinear, scaleUtc } from 'd3';
import { LinesConfig } from 'src/app/shared/components/charts/lines/lines.model';
import { QuantitativeAxisConfig } from 'src/app/shared/components/charts/xy-chart-space/axis-config.model';
import { JobDatum } from '../../art-history-data.model';
import { ValueType } from '../explore-selections/explore-selections.model';

export class ExploreTimeRangeChartConfig extends LinesConfig {
    constructor() {
        super();
        this.x.valueAccessor = (d: JobDatum) => d.year;
        this.x.scaleType = scaleUtc;
        this.y.scaleType = scaleLinear;
        this.pointMarker = { radius: 3 };
        this.showTooltip = true;
        this.tooltipDetectionRadius = 80;
    }
}

export class ExploreTimeRangeXAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.tickFormat = '%Y';
    }
}

export class ExploreTimeRangeYAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.numTicks = 5;
        this.removeDomain = true;
    }
}

export interface ExploreTimeRangeChartData {
    data: JobDatum[];
    dataType: ValueType.count | ValueType.percent;
    categories: LineCategoryType;
}

export type LineCategoryType = 'field' | 'isTt' | 'rank';
