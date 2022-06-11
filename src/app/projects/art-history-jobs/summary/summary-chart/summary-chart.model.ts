import { scaleUtc } from 'd3';
import { StackedAreaConfig } from 'src/app/shared/components/charts/stacked-area/stacked-area.model';
import { QuantitativeAxisConfig } from 'src/app/shared/components/charts/xy-chart-space/axis-config.model';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';

export class SummaryChartConfig extends StackedAreaConfig {
    constructor() {
        super();
        this.x.valueAccessor = (x) => x.year;
        this.y.valueAccessor = (x) => x.count;
        this.category.valueAccessor = (x) => x.field;
        this.x.scaleType = scaleUtc;
        this.x.valueFormat = artHistoryFormatSpecifications.summary.chart.value.year;
        this.y.valueFormat = artHistoryFormatSpecifications.summary.chart.value.count;
        this.showTooltip = false;
        this.category.colors = undefined;
    }
}

export class SummaryChartXAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.tickFormat = artHistoryFormatSpecifications.summary.chart.tick.year;
    }
}

export class SummaryChartYAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.numTicks = 5;
        this.removeDomain = true;
        this.tickFormat = artHistoryFormatSpecifications.summary.chart.tick.count;
    }
}
