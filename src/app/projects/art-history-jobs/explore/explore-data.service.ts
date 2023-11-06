import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import {
  JobDatum,
  JobDatumTimeRangeChart,
  LineDef,
} from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import {
  ExploreChangeChartData,
  ExploreChartsData,
  ExploreTimeRangeChartData,
} from './explore-data.model';
import { ExploreSelections } from './explore-selections/explore-selections.model';

@Injectable()
export class ExploreDataService {
  selections: BehaviorSubject<ExploreSelections> = new BehaviorSubject(null);
  selections$ = this.selections.asObservable();
  chartsData$: Observable<ExploreChartsData>;

  constructor(private artHistoryDataService: ArtHistoryDataService) {
    this.setExploreChartsData();
  }

  init(): void {
    this.setExploreChartsData();
  }

  setExploreChartsData(): void {
    const selections$ = this.selections$.pipe(
      filter((selections) => selections !== null)
    );

    this.chartsData$ = selections$.pipe(
      withLatestFrom(this.artHistoryDataService.data$),
      filter(([selections, data]) => !!selections && !!data),
      map(([selections, data]) => {
        const lineDefs = this.getLineDefs(selections);
        const timeRange = {
          data: this.getLineChartDataForSelections(selections, lineDefs, data),
          dataType: selections.dataType,
          categories: this.getLineChartCategoriesAccessor(selections),
        };
        const change = this.getChangeChartData(selections, lineDefs, timeRange);
        return {
          timeRange,
          change,
        };
      }),
      shareReplay()
    );
  }

  private getChangeChartData(
    selections: ExploreSelections,
    lineDefs: LineDef[],
    timeRangeChartData: ExploreTimeRangeChartData
  ): ExploreChangeChartData {
    const lines = lineDefs.map((x) => x[timeRangeChartData.categories]);
    const data = lines.map((lineType) => {
      const start = timeRangeChartData.data.find(
        (x) =>
          x[timeRangeChartData.categories] === lineType &&
          x.year.getFullYear() === selections.years.start
      );
      const end = timeRangeChartData.data.find(
        (x) =>
          x[timeRangeChartData.categories] === lineType &&
          x.year.getFullYear() === selections.years.end
      );
      const { year, ...newDatum } = start;
      newDatum.count = end.count - start.count;
      if (newDatum.percent) {
        newDatum.percent = end.percent - start.percent;
      }
      return newDatum;
    });
    return {
      data,
      dataType: timeRangeChartData.dataType,
      categories: timeRangeChartData.categories,
    };
  }

  private getLineChartDataForSelections(
    selections: ExploreSelections,
    lineDefs: LineDef[],
    data: JobDatum[]
  ): JobDatumTimeRangeChart[] {
    const dataForYearsRange = this.getFilteredDataForYearsRange(
      selections,
      data
    );
    const dataForSelections = lineDefs
      .map((lineDef) => {
        const filteredData = this.getFilteredDataForLineDef(
          lineDef,
          dataForYearsRange
        );
        let aggregatedData = filteredData;
        if (lineDef.rank !== 'All') {
          aggregatedData = this.getAggregatedDataForRankByYear(
            aggregatedData,
            filteredData,
            lineDef
          );
        }
        if (selections.dataType === 'percent') {
          const categoriesAccessor =
            this.getLineChartCategoriesAccessor(selections);
          aggregatedData.forEach((x) => {
            this.setPercentValueOnDatum(x, lineDef, data, categoriesAccessor);
          });
        }
        return aggregatedData;
      })
      .flat();
    const chartDataForSelections =
      this.transformDataRankToString(dataForSelections);
    return chartDataForSelections;
  }

  private getLineDefs(selections: ExploreSelections): LineDef[] {
    const lines = [];
    for (const field of selections.fields) {
      for (const isTt of selections.tenureValues) {
        for (const rank of selections.rankValues) {
          lines.push({ field, isTt, rank });
        }
      }
    }
    return lines;
  }

  private getFilteredDataForYearsRange(
    selections: ExploreSelections,
    data: JobDatum[]
  ): JobDatum[] {
    return data.filter(
      (x) =>
        x.year.getFullYear() >= selections.years.start &&
        x.year.getFullYear() <= selections.years.end
    );
  }

  private getFilteredDataForLineDef(
    def: LineDef,
    data: JobDatum[]
  ): JobDatum[] {
    const dataForField = data.filter((x) => x.field === def.field);
    const dataForIsTt = dataForField.filter((x) => x.isTt === def.isTt);
    const dataForRank = dataForIsTt.filter((x) => x.rank.includes(def.rank));
    return dataForRank;
    // return data.filter((x) => x.field === def.field && x.isTt === def.isTt && x.rank.includes(def.rank));
  }

  private getAggregatedDataForRankByYear(
    data: JobDatum[],
    filteredData: JobDatum[],
    def: LineDef
  ) {
    const uniqueYears = [
      ...new Set(filteredData.map((x) => x.year.getFullYear())),
    ];
    data = uniqueYears.map((year) => {
      const dataForYear = filteredData.filter(
        (x) => x.year.getFullYear() === year
      );
      const datumForYear = dataForYear[0];
      if (dataForYear.length > 1) {
        datumForYear.count = this.getSummedCountFromData(dataForYear);
      }
      datumForYear.rank = [def.rank];
      return datumForYear;
    });
    return data;
  }

  private getSummedCountFromData(data: JobDatum[]): number {
    return data.reduce((acc, x) => {
      acc += x.count;
      return acc;
    }, 0);
  }

  private getLineChartCategoriesAccessor(
    selections: ExploreSelections
  ): 'field' | 'isTt' | 'rank' {
    if (selections.tenureUse === 'disaggregate') {
      return 'isTt';
    } else if (selections.rankUse === 'disaggregate') {
      return 'rank';
    } else {
      return 'field';
    }
  }

  private setPercentValueOnDatum(
    x: JobDatum,
    def: LineDef,
    allData: JobDatum[],
    categoriesAccessor: string
  ): void {
    let allDatum;
    const dataForYear = allData.filter(
      (d) => d.year.getFullYear() === x.year.getFullYear()
    );
    if (categoriesAccessor === 'isTt') {
      allDatum = dataForYear.filter(
        (d) =>
          d.field === def.field && d.isTt === 'All' && d.rank.includes(def.rank)
      );
    } else if (categoriesAccessor === 'rank') {
      allDatum = dataForYear.filter(
        (d) =>
          d.field === def.field &&
          d.isTt === def.isTt &&
          d.rank.length === 1 &&
          d.rank[0] === 'All'
      );
    } else {
      allDatum = dataForYear.filter(
        (d) =>
          d.field.toLowerCase() === 'all' &&
          d.isTt === def.isTt &&
          d.rank.includes(def.rank)
      );
    }
    x.percent = x.count / allDatum[0].count;
  }

  private transformDataRankToString(
    data: JobDatum[]
  ): JobDatumTimeRangeChart[] {
    return data.map((x) => {
      const newObj = {} as JobDatumTimeRangeChart;
      newObj.year = x.year;
      newObj.field = x.field;
      newObj.isTt = x.isTt;
      newObj.count = x.count;
      newObj.percent = x.percent;
      newObj.rank = x.rank[0];
      return newObj;
    });
  }

  updateSelections(selections: ExploreSelections): void {
    this.selections.next(selections);
  }
}
