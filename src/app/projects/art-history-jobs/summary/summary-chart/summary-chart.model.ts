import { scaleTime } from 'd3';
import { VicAxisConfig } from 'src/app/viz-components/axes/axis.config';
import { VicStackedAreaConfig } from 'src/app/viz-components/stacked-area/stacked-area.config';
import { JobDatum } from '../../art-history-data.model';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';

export class SummaryChartConfig extends VicStackedAreaConfig {
  constructor() {
    super();
    this.x.valueAccessor = (x: JobDatum) => x.year;
    this.y.valueAccessor = (x: JobDatum) => x.count;
    this.category.valueAccessor = (x: JobDatum) => x.field;
    this.x.scaleType = scaleTime;
    this.x.valueFormat =
      artHistoryFormatSpecifications.summary.chart.value.year;
    this.y.valueFormat =
      artHistoryFormatSpecifications.summary.chart.value.count;
    this.category.colors = undefined;
  }
}

export class SummaryChartXAxisConfig extends VicAxisConfig {
  constructor() {
    super();
    this.tickFormat = artHistoryFormatSpecifications.summary.chart.tick.year;
  }
}

export class SummaryChartYAxisConfig extends VicAxisConfig {
  constructor() {
    super();
    this.numTicks = 5;
    this.removeDomain = true;
    this.tickFormat = artHistoryFormatSpecifications.summary.chart.tick.count;
  }
}
