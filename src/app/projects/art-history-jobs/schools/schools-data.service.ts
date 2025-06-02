import { Injectable } from '@angular/core';
import { ascending, descending } from 'd3';
import { cloneDeep, isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  scan,
  shareReplay,
  take,
  withLatestFrom,
} from 'rxjs';
import { SearchUtilities } from 'src/app/core/utilities/search.util';
import { JobProperty, JobsByCountry } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import {
  artHistoryFields,
  rankOptions,
  tenureOptions,
} from '../art-history-fields.constants';
import { ArtHistoryUtilities } from '../art-history.utilities';

export enum SchoolStateProperty {
  field = 'field',
  tenure = 'tenure',
  rank = 'rank',
  sortOrder = 'sortOrder',
  searchTerms = 'searchTerms',
}

export enum SchoolSort {
  asc = 'asc',
  desc = 'desc',
  alpha = 'alpha',
}

export interface SchoolsState {
  [JobProperty.field]: string[];
  [JobProperty.tenure]: string[];
  [JobProperty.rank]: string[];
  [SchoolStateProperty.sortOrder]: keyof typeof SchoolSort;
  [SchoolStateProperty.searchTerms]: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SchoolsDataService {
  fieldOptions = cloneDeep(
    artHistoryFields.filter((x) => x.name.full !== 'All')
  );
  tenureOptions = tenureOptions;
  rankOptions = rankOptions;
  sortOptions = [
    { value: SchoolSort.desc, label: 'Jobs' },
    { value: SchoolSort.asc, label: 'Jobs' },
    { value: SchoolSort.alpha, label: 'A to Z' },
  ];
  yearRange: string[];
  dataBySchool$: Observable<JobsByCountry[]>;
  private state: BehaviorSubject<SchoolsState> =
    new BehaviorSubject<SchoolsState>({
      field: this.fieldOptions.map((x) => x.name.full),
      tenure: this.tenureOptions.map((x) => x.label),
      rank: this.rankOptions.map((x) => x.label),
      sortOrder: this.sortOptions[0].value,
      searchTerms: [],
    });
  state$ = this.state.asObservable();

  constructor(public dataService: ArtHistoryDataService) {}

  init(): void {
    console.log('Initializing SchoolsDataService', this.state.getValue());
    if (this.dataBySchool$) {
      return;
    }
    const data$ = this.dataService.dataBySchool$.pipe(filter((x) => !!x));
    const filterSelections$ = this.state$.pipe(
      map((state) => {
        return {
          field: state.field,
          tenure: state.tenure,
          rank: state.rank,
          searchTerms: state.searchTerms,
        };
      }),
      distinctUntilChanged((a, b) => isEqual(a, b))
    );

    const sortOrder$ = this.state$.pipe(
      map((state) => state.sortOrder),
      distinctUntilChanged()
    );

    data$.pipe(take(1)).subscribe((data) => {
      this.yearRange = data[0].jobsBySchool[0].jobsByYear.map((x) => x.year);
    });

    const filterData$ = combineLatest([data$, filterSelections$]).pipe(
      withLatestFrom(sortOrder$),
      map(([[data, state], sortOrder]) => () => {
        const filteredData = cloneDeep(this.filterDataForState(data, state));
        this.sortData(filteredData, sortOrder);
        return filteredData;
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    const sortData$ = combineLatest([sortOrder$, data$]).pipe(
      map(([sortOrder, data]) => (filteredData) => {
        const modifiedData = filteredData ?? data;
        this.sortData(modifiedData, sortOrder);
        return modifiedData;
      })
    );

    this.dataBySchool$ = merge(filterData$, sortData$).pipe(
      scan((data, mutationFn) => mutationFn(data), [] as JobsByCountry[]),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  sortData(data: JobsByCountry[], sortOrder: 'asc' | 'desc' | 'alpha'): void {
    if (data.length > 0) {
      if (sortOrder === SchoolSort.alpha) {
        this.sortSchoolsAlphabetically(data);
      } else {
        this.sortSchoolsByJobCount(data, sortOrder);
      }
    }
  }

  sortSchoolsAlphabetically(data: JobsByCountry[]): void {
    data.forEach((country) => {
      country.jobsBySchool.sort((a, b) => ascending(a.school, b.school));
    });
  }

  sortSchoolsByJobCount(
    data: JobsByCountry[],
    order: keyof typeof SchoolSort
  ): void {
    data.forEach((country) => {
      country.jobsBySchool.sort((a, b) => {
        const aCount = a.jobsByYear.reduce((acc, year) => {
          acc += year.jobs.length;
          return acc;
        }, 0);
        const bCount = b.jobsByYear.reduce((acc, year) => {
          acc += year.jobs.length;
          return acc;
        }, 0);
        const sortFunction = order === SchoolSort.asc ? ascending : descending;
        return sortFunction(aCount, bCount);
      });
    });
  }

  filterDataForState(
    data: JobsByCountry[],
    state: Partial<SchoolsState>
  ): JobsByCountry[] {
    let filteredData = cloneDeep(data);
    if (
      state.searchTerms.length > 0 ||
      state.field.length !== this.fieldOptions.length ||
      state.tenure.length !== this.tenureOptions.length ||
      state.rank.length !== this.rankOptions.length
    ) {
      filteredData = this.getFilteredDataForState(filteredData, state);
    }
    return filteredData;
  }

  getFilteredDataForState(
    data: JobsByCountry[],
    state: Partial<SchoolsState>
  ): JobsByCountry[] {
    let filteredDataByCountry = data.map((country) => {
      country.jobsBySchool = country.jobsBySchool.map((school) => {
        if (
          state.searchTerms.length === 0 ||
          (state.searchTerms.length > 0 &&
            SearchUtilities.hasPartialMatchesInText(
              school.school,
              state.searchTerms
            ))
        ) {
          school.jobsByYear = school.jobsByYear.map((year) => {
            year.jobs = year.jobs.filter((job) => {
              const inFields =
                state.field.length !== this.fieldOptions.length
                  ? state.field.some((field) => {
                      return job.field.includes(field);
                    })
                  : true;
              const inTenure =
                state.tenure.length !== this.tenureOptions.length
                  ? state.tenure.includes(
                      ArtHistoryUtilities.transformIsTt(job.tenure)
                    )
                  : true;
              const inRank =
                state.rank.length !== this.rankOptions.length
                  ? state.rank.some((rank) => {
                      return job.rank
                        .map((x) => ArtHistoryUtilities.transformRank(x))
                        .includes(rank);
                    })
                  : true;
              return inFields && inTenure && inRank;
            });
            return year;
          });
          return school;
        } else {
          school.jobsByYear = [];
          return school;
        }
      });
      country.jobsBySchool = country.jobsBySchool.filter((school) => {
        return school.jobsByYear.some((year) => {
          return year.jobs.length > 0;
        });
      });
      return country;
    });
    filteredDataByCountry = filteredDataByCountry.filter((country) => {
      return country.jobsBySchool.length > 0;
    });
    return filteredDataByCountry;
  }

  updateState(
    selection: string[],
    property: keyof typeof SchoolStateProperty
  ): void {
    console.log(
      `Updating state for ${property} with selection: ${selection.join(', ')}`
    );
    const current = this.state.getValue();
    const updated = { ...current, [property]: selection };
    this.state.next(updated);
  }

  updateSortOrder(selection: keyof typeof SchoolSort): void {
    const current = this.state.getValue();
    const updated = { ...current, sortOrder: selection };
    this.state.next(updated);
  }
}
