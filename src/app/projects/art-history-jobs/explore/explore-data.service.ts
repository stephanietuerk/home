import { Injectable } from '@angular/core';
import { cloneDeep, isEqual } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  withLatestFrom,
} from 'rxjs/operators';
import { Unsubscribe } from 'src/app/viz-components/shared/unsubscribe.class';
import { JobDatum, LineDef } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { artHistoryFields } from '../art-history-fields.constants';
import { EntityCategory } from './explore-data.model';
import {
  rankValueOptions,
  tenureValueOptions,
} from './explore-selections/explore-selections.constants';
import {
  ExploreSelections,
  FilterType,
  ValueType,
} from './explore-selections/explore-selections.model';

@Injectable()
export class ExploreDataService extends Unsubscribe {
  defaultSelections: ExploreSelections = {
    valueType: ValueType.count,
    years: {
      start: undefined,
      end: undefined,
    },
    fields: [artHistoryFields[0].name.full],
    fieldsUse: FilterType.filter,
    tenureUse: FilterType.disaggregate,
    tenureValues: [tenureValueOptions[1].label, tenureValueOptions[2].label],
    rankUse: FilterType.filter,
    rankValues: [rankValueOptions[0].label],
  };
  private selections: BehaviorSubject<ExploreSelections> = new BehaviorSubject(
    null
  );
  selections$ = this.selections.asObservable();
  acrossTimeData$: Observable<JobDatum[]>;
  changeData$: Observable<JobDatum[]>;
  entityCategory$: Observable<EntityCategory>;

  constructor(private artHistoryData: ArtHistoryDataService) {
    super();
  }

  init(): void {
    this.initDefaultSelections();
    this.setExploreChartsData();
  }

  initDefaultSelections(): void {
    this.defaultSelections.years.start = this.artHistoryData.dataYears[0];
    this.defaultSelections.years.end = this.artHistoryData.dataYears[1];
    this.selections.next(this.defaultSelections);
  }

  setExploreChartsData(): void {
    const selections$ = this.selections$.pipe(
      filter((selections) => selections !== null)
    );

    const lineDefs$ = selections$.pipe(
      map((selections) => this.getLineDefs(selections))
    );

    this.entityCategory$ = selections$.pipe(
      map((selections) => this.getLineChartCategoriesAccessor(selections))
    );

    this.acrossTimeData$ = selections$.pipe(
      withLatestFrom(this.artHistoryData.data$, lineDefs$),
      filter(([selections, data]) => !!selections && !!data),
      map(([selections, data, lineDefs]) =>
        this.getAcrossTimeData(selections, lineDefs, data)
      ),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    this.changeData$ = selections$.pipe(
      withLatestFrom(this.acrossTimeData$, lineDefs$, this.entityCategory$),
      filter(([selections, data]) => !!selections && !!data),
      map(([selections, data, lineDefs, entityCategory]) =>
        this.getChangeChartData(selections, lineDefs, data, entityCategory)
      ),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  private getChangeChartData(
    selections: ExploreSelections,
    lineDefs: LineDef[],
    timeRangeChartData: JobDatum[],
    entityCategory: EntityCategory
  ): JobDatum[] {
    const lines = lineDefs.map((x) => x[entityCategory]);
    const data = lines.map((lineType) => {
      const start = timeRangeChartData.find(
        (x) =>
          x[entityCategory] === lineType &&
          x.year.getFullYear() === selections.years.start
      );
      const end = timeRangeChartData.find(
        (x) =>
          x[entityCategory] === lineType &&
          x.year.getFullYear() === selections.years.end
      );
      const newDatum = cloneDeep(start);
      newDatum.count = end.count - start.count;
      if (newDatum.percent) {
        newDatum.percent = end.percent - start.percent;
      }
      newDatum.year = null;
      return newDatum;
    });
    return data;
  }

  private getAcrossTimeData(
    selections: ExploreSelections,
    lineDefs: LineDef[],
    data: JobDatum[]
  ): JobDatum[] {
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
        if (selections.valueType === ValueType.percent) {
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
    // const dataForField = data.filter((x) => x.field === def.field);
    // const dataForIsTt = dataForField.filter((x) => x.isTt === def.isTt);
    // const dataForRank = dataForIsTt.filter((x) => x.rank.includes(def.rank));
    const filteredData = data.filter(
      (x) =>
        x.field === def.field &&
        x.isTt === def.isTt &&
        x.rank.includes(def.rank)
    );
    return filteredData;
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

  private transformDataRankToString(data: JobDatum[]): JobDatum[] {
    const transformedData = data.map((x) => {
      const newObj = {} as JobDatum;
      newObj.year = x.year;
      newObj.field = x.field;
      newObj.isTt = x.isTt;
      newObj.count = x.count;
      newObj.percent = x.percent;
      newObj.rank = x.rank[0];
      return newObj;
    });
    return transformedData;
  }

  updateSelections(selections: Partial<ExploreSelections>): void {
    const update = this.getUpdatedSelections(selections);
    this.selections.next(update);
  }

  getUpdatedSelections(
    userUpdate: Partial<ExploreSelections>
  ): ExploreSelections {
    if (Object.keys(userUpdate).includes('tenureUse')) {
      const update = this.getUpdateForVariableUseChange(
        userUpdate,
        'tenureUse'
      );
      return { ...this.selections.getValue(), ...update };
    } else if (Object.keys(userUpdate).includes('rankUse')) {
      const update = this.getUpdateForVariableUseChange(userUpdate, 'rankUse');
      return { ...this.selections.getValue(), ...update };
    } else if (Object.keys(userUpdate).includes('fieldsUse')) {
      const update = this.getUpdateForFieldsUseChange(userUpdate);
      return { ...this.selections.getValue(), ...update };
    } else if (Object.keys(userUpdate).includes('valueType')) {
      return this.getUpdateForValueTypeChange(userUpdate);
    } else {
      return { ...this.selections.getValue(), ...userUpdate };
    }
  }

  getUpdateForVariableUseChange(
    userUpdate: Partial<ExploreSelections>,
    variableUse: 'tenureUse' | 'rankUse'
  ): Partial<ExploreSelections> {
    const current = this.selections.getValue();
    const variableValues =
      variableUse === 'tenureUse' ? 'tenureValues' : 'rankValues';
    const altVariableUse =
      variableUse === 'tenureUse' ? 'rankUse' : 'tenureUse';
    const altVariableValues =
      variableUse === 'tenureUse' ? 'rankValues' : 'tenureValues';
    const options =
      variableUse === 'tenureUse' ? tenureValueOptions : rankValueOptions;
    const altOptions =
      variableUse === 'tenureUse' ? rankValueOptions : tenureValueOptions;
    let changedValues;
    let otherValues = current[altVariableValues];
    let fields = current.fields;
    let fieldsUse = current.fieldsUse;
    if (userUpdate[variableUse] === FilterType.filter) {
      changedValues = [options[0].label];
    } else {
      changedValues = options
        .filter((x) =>
          current.valueType === ValueType.percent ? x.value !== 'all' : true
        )
        .map((x) => x.label);
      otherValues = [altOptions[0].label];
      fields = current.fields[0]
        ? [current.fields[0]]
        : [artHistoryFields[0].name.full];
      fieldsUse = FilterType.filter;
    }
    return {
      [variableUse]: userUpdate[variableUse],
      [variableValues]: changedValues,
      [altVariableUse]:
        userUpdate[variableUse] === FilterType.disaggregate
          ? FilterType.filter
          : current[altVariableUse],
      [altVariableValues]: otherValues,
      fields,
      fieldsUse,
    };
  }

  getUpdateForFieldsUseChange(
    userUpdate: Partial<ExploreSelections>
  ): Partial<ExploreSelections> {
    const current = this.selections.getValue();
    let fields = current.fields;
    let tenureUse = current.tenureUse;
    let rankUse = current.rankUse;
    let tenureValues = current.tenureValues;
    let rankValues = current.rankValues;
    if (userUpdate.fieldsUse === FilterType.filter) {
      fields = [current.fields[0]];
    } else {
      tenureUse = FilterType.filter;
      rankUse = FilterType.filter;
      tenureValues = [tenureValueOptions[0].label];
      rankValues = [rankValueOptions[0].label];
    }
    return {
      fields,
      fieldsUse: userUpdate.fieldsUse,
      tenureUse,
      rankUse,
      tenureValues,
      rankValues,
    };
  }

  getUpdateForValueTypeChange(
    userUpdate: Partial<ExploreSelections>
  ): ExploreSelections {
    const current = this.selections.getValue();
    const update = { ...current, ...userUpdate };
    if (userUpdate.valueType === ValueType.percent) {
      if (current.fieldsUse === FilterType.disaggregate) {
        update.fields = update.fields.filter((x) => x.toLowerCase() !== 'all');
      }
      if (current.tenureUse === FilterType.disaggregate) {
        update.tenureValues = update.tenureValues.filter(
          (x) => x.toLowerCase() !== 'all'
        );
      }
      if (current.rankUse === FilterType.disaggregate) {
        update.rankValues = update.rankValues.filter(
          (x) => x.toLowerCase() !== 'all'
        );
      }
    }
    return update;
  }
}
