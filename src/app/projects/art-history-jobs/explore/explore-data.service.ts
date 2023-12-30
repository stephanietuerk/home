import { Injectable } from '@angular/core';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  withLatestFrom,
} from 'rxjs/operators';
import { Unsubscribe } from 'src/app/viz-components/shared/unsubscribe.class';
import { JobDatum, JobProperty, LineDef } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { artHistoryFields } from '../art-history-fields.constants';
import { EntityCategory, ExploreChangeDatum } from './explore-data.model';
import {
  fieldValueOptions,
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
    fieldUse: FilterType.filter,
    fieldValues: [artHistoryFields[0].name.full],
    tenureUse: FilterType.disaggregate,
    tenureValues: [tenureValueOptions[1].label, tenureValueOptions[2].label],
    rankUse: FilterType.filter,
    rankValues: [rankValueOptions[0].label],
    changeIsAverage: true,
  };
  private selections: BehaviorSubject<ExploreSelections> = new BehaviorSubject(
    null
  );
  selections$ = this.selections.asObservable();
  acrossTimeData$: Observable<JobDatum[]>;
  changeData$: Observable<ExploreChangeDatum[]>;
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
  ): ExploreChangeDatum[] {
    const lines = lineDefs.map((x) => x[entityCategory]);
    const data = lines.map((lineType) => {
      const end = timeRangeChartData.find(
        (x) =>
          x[entityCategory] === lineType &&
          x.year.getFullYear() === selections.years.end
      );
      const endValue = end[selections.valueType];
      const newDatum = {} as ExploreChangeDatum;
      newDatum.field = end.field;
      newDatum.tenure = end.tenure;
      newDatum.rank = end.rank;
      let compareValue;
      if (selections.changeIsAverage) {
        const allValues = timeRangeChartData
          .filter((x) => x[entityCategory] === lineType)
          .map((x) => x[selections.valueType]);
        compareValue =
          allValues.reduce((acc, x) => {
            acc += x;
            return acc;
          }, 0) / allValues.length;
      } else {
        compareValue = timeRangeChartData.find(
          (x) =>
            x[entityCategory] === lineType &&
            x.year.getFullYear() === selections.years.start
        )[selections.valueType];
      }
      newDatum.startValue = compareValue;
      newDatum.endValue = endValue;
      if (selections.valueType === ValueType.count) {
        newDatum.count = endValue - compareValue;
      } else {
        newDatum.percent = endValue - compareValue;
      }
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
    for (const field of selections.fieldValues) {
      for (const tenure of selections.tenureValues) {
        for (const rank of selections.rankValues) {
          lines.push({ field, tenure, rank });
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
    const filteredData = data.filter(
      (x) =>
        x.field === def.field &&
        x.tenure === def.tenure &&
        x.rank.includes(def.rank)
    );
    return filteredData;
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
  ): EntityCategory {
    if (selections.tenureUse === 'disaggregate') {
      return JobProperty.tenure;
    } else if (selections.rankUse === 'disaggregate') {
      return JobProperty.rank;
    } else {
      return JobProperty.field;
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
    if (categoriesAccessor === JobProperty.tenure) {
      allDatum = dataForYear.filter(
        (d) =>
          d.field === def.field &&
          d.tenure === 'All' &&
          d.rank.includes(def.rank)
      );
    } else if (categoriesAccessor === JobProperty.rank) {
      allDatum = dataForYear.filter(
        (d) =>
          d.field === def.field &&
          d.tenure === def.tenure &&
          d.rank.length === 1 &&
          d.rank[0] === 'All'
      );
    } else {
      allDatum = dataForYear.filter(
        (d) =>
          d.field.toLowerCase() === 'all' &&
          d.tenure === def.tenure &&
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
      newObj.tenure = x.tenure;
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
      const update = this.getUpdateForVariableUseChange2(
        userUpdate,
        JobProperty.tenure
      );
      return { ...this.selections.getValue(), ...update };
    } else if (Object.keys(userUpdate).includes('rankUse')) {
      const update = this.getUpdateForVariableUseChange2(
        userUpdate,
        JobProperty.rank
      );
      return { ...this.selections.getValue(), ...update };
    } else if (Object.keys(userUpdate).includes('fieldUse')) {
      const update = this.getUpdateForVariableUseChange2(
        userUpdate,
        JobProperty.field
      );
      return { ...this.selections.getValue(), ...update };
    } else if (Object.keys(userUpdate).includes('valueType')) {
      return this.getUpdateForValueTypeChange(userUpdate);
    } else {
      return { ...this.selections.getValue(), ...userUpdate };
    }
  }

  getUpdateForVariableUseChange2(
    userUpdate: Partial<ExploreSelections>,
    variable: EntityCategory
  ): Partial<ExploreSelections> {
    const current = this.selections.getValue();
    const variableUse = `${variable}Use`;
    const variableValues = `${variable}Values`;
    let options;
    let otherVariables;
    let changedValues;
    let otherValues;
    if (variable === JobProperty.field) {
      options = fieldValueOptions;
      otherVariables = [JobProperty.tenure, JobProperty.rank];
    } else if (variable === JobProperty.tenure) {
      options = tenureValueOptions;
      otherVariables = [JobProperty.field, JobProperty.rank];
    } else {
      options = rankValueOptions;
      otherVariables = [JobProperty.field, JobProperty.tenure];
    }
    if (userUpdate[variableUse] === FilterType.filter) {
      changedValues =
        variable === JobProperty.field
          ? [current.fieldValues[0]] ?? [options[0].label]
          : [options[0].label];
    } else {
      changedValues = options
        .filter((x) =>
          current.valueType === ValueType.percent
            ? x.value !== 'all'
            : variable === JobProperty.field
            ? x.value === current.fieldValues[0]
            : true
        )
        .map((x) => x.label);
      otherValues = otherVariables.reduce((acc, x) => {
        const otherOptions =
          x === JobProperty.field
            ? fieldValueOptions
            : x === JobProperty.tenure
            ? tenureValueOptions
            : rankValueOptions;
        acc[`${x}Values`] = [otherOptions[0].label];
        acc[`${x}Use`] = FilterType.filter;
        return acc;
      }, {} as Partial<ExploreSelections>);
    }
    return {
      [variableUse]: userUpdate[variableUse],
      [variableValues]: changedValues,
      ...otherValues,
    };
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
    let fieldValues = current.fieldValues;
    let fieldUse = current.fieldUse;
    if (userUpdate[variableUse] === FilterType.filter) {
      changedValues = [options[0].label];
    } else {
      changedValues = options
        .filter((x) =>
          current.valueType === ValueType.percent ? x.value !== 'all' : true
        )
        .map((x) => x.label);
      otherValues = [altOptions[0].label];
      fieldValues = current.fieldValues[0]
        ? [current.fieldValues[0]]
        : [artHistoryFields[0].name.full];
      fieldUse = FilterType.filter;
    }
    return {
      [variableUse]: userUpdate[variableUse],
      [variableValues]: changedValues,
      [altVariableUse]:
        userUpdate[variableUse] === FilterType.disaggregate
          ? FilterType.filter
          : current[altVariableUse],
      [altVariableValues]: otherValues,
      fieldValues,
      fieldUse,
    };
  }

  getUpdateForFieldsUseChange(
    userUpdate: Partial<ExploreSelections>
  ): Partial<ExploreSelections> {
    const current = this.selections.getValue();
    let fieldValues = current.fieldValues;
    let tenureUse = current.tenureUse;
    let rankUse = current.rankUse;
    let tenureValues = current.tenureValues;
    let rankValues = current.rankValues;
    if (userUpdate.fieldUse === FilterType.filter) {
      fieldValues = [current.fieldValues[0]];
    } else {
      tenureUse = FilterType.filter;
      rankUse = FilterType.filter;
      tenureValues = [tenureValueOptions[0].label];
      rankValues = [rankValueOptions[0].label];
    }
    return {
      fieldValues,
      fieldUse: userUpdate.fieldUse,
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
      if (current.fieldUse === FilterType.disaggregate) {
        update.fieldValues = update.fieldValues.filter(
          (x) => x.toLowerCase() !== 'all'
        );
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
