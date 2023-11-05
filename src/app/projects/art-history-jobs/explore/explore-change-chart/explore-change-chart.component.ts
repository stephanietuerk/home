import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { JobDatumChangeChart } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { ExploreChangeChartData } from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  ChangeChartConfig,
  ChangeChartXAxisConfig,
  ChangeChartYAxisConfig,
} from './explore-change-chart.model';

interface ViewModel {
  dataMarksConfig: ChangeChartConfig;
  xAxisConfig: ChangeChartXAxisConfig;
  yAxisConfig: ChangeChartXAxisConfig;
  height: number;
}
@Component({
  selector: 'app-explore-change-chart',
  templateUrl: './explore-change-chart.component.html',
  styleUrls: ['./explore-change-chart.component.scss'],
})
export class ExploreChangeChartComponent implements OnInit {
  vm$: Observable<ViewModel>;
  width = 800;
  margin: ElementSpacing = {
    top: 36,
    right: 36,
    bottom: 36,
    left: 96,
  };
  barHeight = 54;

  constructor(
    private exploreDataService: ExploreDataService,
    private fieldsService: ArtHistoryFieldsService
  ) {}

  ngOnInit(): void {
    this.vm$ = this.exploreDataService.chartsData$.pipe(
      map((chartsData) => {
        if (chartsData.change) {
          return {
            dataMarksConfig: this.getDataMarksConfig(chartsData.change),
            xAxisConfig: this.getXAxisConfig(chartsData.change),
            yAxisConfig: this.getYAxisConfig(),
            height: this.setChartHeight(chartsData.change.data),
          };
        }
      })
    );
  }

  getDataMarksConfig(chartData: ExploreChangeChartData): ChangeChartConfig {
    const config = new ChangeChartConfig();
    config.data = chartData.data;
    config.ordinal.valueAccessor = (d) => d[chartData.categories];
    config.quantitative.valueAccessor = (d) => d[chartData.dataType];
    config.quantitative.domain = this.getQuantitativeDomain(chartData);
    config.quantitative.valueFormat =
      this.getQuantitativeValueFormat(chartData);
    config.category.valueAccessor = (d) => d[chartData.categories];
    config.category.colorScale = this.getColorScale(chartData);
    return config;
  }

  getColorScale(chartData: ExploreChangeChartData): (x: any) => any {
    if (chartData.categories === 'field') {
      return (d) => this.fieldsService.getColorForField(d);
    } else {
      const color = this.fieldsService.getColorForField(
        chartData.data[0].field
      );
      return (d) => color;
    }
  }

  getQuantitativeDomain(chartData: ExploreChangeChartData): any {
    return chartData.dataType === 'percent' ? [0, 1] : undefined;
  }

  getQuantitativeValueFormat(chartData: ExploreChangeChartData): string {
    return artHistoryFormatSpecifications.explore.chart.value[
      chartData.dataType
    ];
  }

  getQuantitativeTickFormat(chartData: ExploreChangeChartData): string {
    return artHistoryFormatSpecifications.explore.chart.tick[
      chartData.dataType
    ];
  }

  setChartHeight(data: JobDatumChangeChart[]): number {
    return data.length * this.barHeight + this.margin.top + this.margin.bottom;
  }

  getXAxisConfig(chartData: ExploreChangeChartData): ChangeChartXAxisConfig {
    const config = new ChangeChartXAxisConfig();
    config.tickFormat = this.getQuantitativeTickFormat(chartData);
    return config;
  }

  getYAxisConfig(): ChangeChartYAxisConfig {
    const config = new ChangeChartYAxisConfig();
    config.wrap.wrapWidth = this.margin.left;
    return config;
  }
}
