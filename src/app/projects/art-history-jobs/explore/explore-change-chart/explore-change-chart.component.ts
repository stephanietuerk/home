import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { ElementSpacing } from 'src/app/core/models/charts.model';
import { JobDatum } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';
import { artHistoryFormatSpecifications } from '../../art-history-jobs.constants';
import { EntityCategory } from '../explore-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  ExploreSelections,
  ValueType,
} from '../explore-selections/explore-selections.model';
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
  title: string;
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
    this.vm$ = combineLatest([
      this.exploreDataService.changeData$,
      this.exploreDataService.selections$,
      this.exploreDataService.entityCategory$,
    ]).pipe(
      filter(([data, selections]) => !!data && !!selections),
      map(([data, selections, entityCategory]) => {
        return {
          dataMarksConfig: this.getDataMarksConfig(
            data,
            entityCategory,
            selections.valueType
          ),
          xAxisConfig: this.getXAxisConfig(selections.valueType),
          yAxisConfig: this.getYAxisConfig(),
          height: this.setChartHeight(data),
          title: this.getTitle(entityCategory, selections),
        };
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  getDataMarksConfig(
    data: JobDatum[],
    entityCategory: EntityCategory,
    valueType: keyof typeof ValueType
  ): ChangeChartConfig {
    const config = new ChangeChartConfig();
    config.data = data;
    config.ordinal.valueAccessor = (d) => d[entityCategory];
    config.quantitative.valueAccessor = (d) => d[valueType];
    config.quantitative.domain = this.getQuantitativeDomain(valueType);
    config.quantitative.valueFormat =
      this.getQuantitativeValueFormat(valueType);
    config.category.valueAccessor = (d) => d[entityCategory];
    config.category.colorScale = this.getColorScale(data, entityCategory);
    return config;
  }

  getColorScale(
    data: JobDatum[],
    entityCategory: EntityCategory
  ): (x: any) => any {
    if (entityCategory === 'field') {
      return (d) => this.fieldsService.getColorForField(d);
    } else {
      const color = this.fieldsService.getColorForField(data[0].field);
      return (d) => color;
    }
  }

  getQuantitativeDomain(valueType: keyof typeof ValueType): any {
    return valueType === 'percent' ? [0, 1] : undefined;
  }

  getQuantitativeValueFormat(valueType: keyof typeof ValueType): string {
    return artHistoryFormatSpecifications.explore.chart.value[valueType];
  }

  getQuantitativeTickFormat(valueType: keyof typeof ValueType): string {
    return artHistoryFormatSpecifications.explore.chart.tick[valueType];
  }

  setChartHeight(data: JobDatum[]): number {
    return data.length * this.barHeight + this.margin.top + this.margin.bottom;
  }

  getXAxisConfig(valueType: keyof typeof ValueType): ChangeChartXAxisConfig {
    const config = new ChangeChartXAxisConfig();
    config.tickFormat = this.getQuantitativeTickFormat(valueType);
    return config;
  }

  getYAxisConfig(): ChangeChartYAxisConfig {
    const config = new ChangeChartYAxisConfig();
    config.wrap.wrapWidth = this.margin.left;
    return config;
  }

  getTitle(
    entityCategory: EntityCategory,
    selections: ExploreSelections
  ): string {
    let fields;
    let disaggregation;
    if (entityCategory === 'field') {
      disaggregation = 'by field';
      if (selections.valueType === 'count') {
        fields = '';
      } else {
        fields = 'all';
      }
    } else {
      fields = selections.fields.join('');
      if (entityCategory === 'isTt') {
        disaggregation = 'by tenure status';
      } else {
        disaggregation = 'by rank';
      }
    }
    return `Change${
      selections.valueType === ValueType.percent ? '(%)' : ''
    } in ${fields.toLowerCase()} jobs ${disaggregation}`;
  }
}
