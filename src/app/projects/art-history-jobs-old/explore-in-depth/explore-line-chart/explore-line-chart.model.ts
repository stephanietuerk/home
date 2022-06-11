import { scaleUtc } from 'd3';
import { LinesConfig } from 'src/app/shared/components/charts/lines/lines.model';
import { QuantitativeAxisConfig } from 'src/app/shared/components/charts/xy-chart-space/axis-config.model';
import { formatSpecifications } from '../../art-history-jobs.constants';
import { JobDatum } from '../../models/art-history-data';

export class ExploreLinesConfig extends LinesConfig {
    constructor() {
        super();
        this.x.valueAccessor = (d: JobDatum): Date => d.year as Date;
        this.x.valueFormat = formatSpecifications.explore.chart.value.year;
        // this.y.valueAccessor = (d: JobDatum): number => d.value;
        // this.category.valueAccessor = (d: JobDatum): string => d.name;
        this.x.scaleType = scaleUtc;
        this.pointMarker = { radius: 4 };
        this.showTooltip = false;
        this.tooltipDetectionRadius = 80;
    }
}

export class ExploreLinesXAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.tickFormat = formatSpecifications.explore.chart.tick.year;
    }
}

export class ExploreLinesYAxisConfig extends QuantitativeAxisConfig {
    constructor() {
        super();
        this.numTicks = 5;
        this.removeDomain = true;
    }
}
