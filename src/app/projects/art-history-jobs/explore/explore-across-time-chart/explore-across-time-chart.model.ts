import { scaleLinear, scaleUtc } from 'd3';
import { VicAxisConfig } from 'src/app/viz-components/axes/axis.config';
import { VicLinesConfig } from 'src/app/viz-components/lines/lines.config';
import { JobDatum } from '../../art-history-data.model';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';

export class ExploreTimeRangeChartConfig extends VicLinesConfig {
  constructor() {
    super();
    this.x.valueAccessor = (d: JobDatum) => d.year;
    this.x.scaleType = scaleUtc;
    this.y.scaleType = scaleLinear;
    this.pointMarkers.display = true;
    this.x.valueFormat =
      artHistoryFormatSpecifications.summary.chart.value.year;
  }
}

export class ExploreTimeRangeXAxisConfig extends VicAxisConfig {
  constructor() {
    super();
    this.tickFormat = '%Y';
  }
}

export class ExploreTimeRangeYAxisConfig extends VicAxisConfig {
  constructor() {
    super();
    this.numTicks = 5;
    this.removeDomain = true;
  }
}
