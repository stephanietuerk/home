import { scaleLinear, scaleUtc } from 'd3';
import { AxisConfig } from 'src/app/shared/charts/axes/axis.config';
import { LinesConfig } from 'src/app/shared/charts/lines/lines.config';
import { JobDatum } from '../../art-history-data.model';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';

export class ExploreTimeRangeChartConfig extends LinesConfig {
    constructor() {
        super();
        this.x.valueAccessor = (d: JobDatum) => d.year;
        this.x.scaleType = scaleUtc;
        this.y.scaleType = scaleLinear;
        this.pointMarker.display = true;
        this.x.valueFormat = artHistoryFormatSpecifications.summary.chart.value.year;
    }
}

export class ExploreTimeRangeXAxisConfig extends AxisConfig {
    constructor() {
        super();
        this.tickFormat = '%Y';
    }
}

export class ExploreTimeRangeYAxisConfig extends AxisConfig {
    constructor() {
        super();
        this.numTicks = 5;
        this.removeDomain = true;
    }
}
