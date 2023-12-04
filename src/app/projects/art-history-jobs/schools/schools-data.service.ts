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
} from 'rxjs';
import { JobsByCountry } from '../art-history-data.model';
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
}

export enum SchoolSort {
  asc = 'asc',
  desc = 'desc',
  alpha = 'alpha',
}

export interface SchoolsState {
  [SchoolStateProperty.field]: string[];
  [SchoolStateProperty.tenure]: string[];
  [SchoolStateProperty.rank]: string[];
  [SchoolStateProperty.sortOrder]: keyof typeof SchoolSort;
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
    { value: SchoolSort.desc, label: 'Job count (desc)' },
    { value: SchoolSort.asc, label: 'Job count (asc)' },
    { value: SchoolSort.alpha, label: 'Alphabetical' },
  ];
  yearRange: string[];
  dataBySchool$: Observable<JobsByCountry[]>;
  private state: BehaviorSubject<SchoolsState> =
    new BehaviorSubject<SchoolsState>({
      field: this.fieldOptions.map((x) => x.name.full),
      tenure: this.tenureOptions.map((x) => x.label),
      rank: this.rankOptions.map((x) => x.label),
      sortOrder: this.sortOptions[0].value,
    });
  state$ = this.state.asObservable();

  constructor(public dataService: ArtHistoryDataService) {}

  init(): void {
    const data$ = this.dataService.dataBySchool$.pipe(filter((x) => !!x));
    const filterSelections$ = this.state$.pipe(
      map((state) => {
        return {
          field: state.field,
          tenure: state.tenure,
          rank: state.rank,
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
      map(([data, state]) => () => {
        return this.filterDataForState(data, state);
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );

    const sortData$ = combineLatest([sortOrder$, data$]).pipe(
      map(([sortOrder, data]) => (filteredData) => {
        console.log('sort', data, filteredData);
        const modifiedData = filteredData ?? data;
        if (modifiedData.length > 0) {
          if (sortOrder === SchoolSort.alpha) {
            this.sortSchoolsAlphabetically(modifiedData);
          } else {
            this.sortSchoolsByJobCount(modifiedData, sortOrder);
          }
          return modifiedData;
        }
      })
    );

    this.dataBySchool$ = merge(filterData$, sortData$).pipe(
      scan((data, mutationFn) => mutationFn(data), [] as JobsByCountry[])
    );
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
      state.field.length !== this.fieldOptions.length ||
      state.tenure.length !== this.tenureOptions.length ||
      state.rank.length !== this.rankOptions.length
    ) {
      filteredData = filteredData.map((country) => {
        country.jobsBySchool = country.jobsBySchool.filter((school) => {
          return school.jobsByYear.some((year) => {
            return year.jobs.some((job) => {
              const inFields =
                state.field.length !== this.fieldOptions.length
                  ? state.field.some((field) => {
                      return job.field.includes(field);
                    })
                  : true;
              const inTenure =
                state.tenure.length !== this.tenureOptions.length
                  ? state.tenure.includes(
                      ArtHistoryUtilities.transformIsTt(job.isTt)
                    )
                  : true;
              const inRank =
                state.rank.length !== this.rankOptions.length
                  ? state.tenure.some((rank) => {
                      return ArtHistoryUtilities.transformRank(
                        job.rank
                      ).includes(rank);
                    })
                  : true;
              return inFields && inTenure && inRank;
            });
          });
        });
        return country;
      });
    }
    return filteredData;
  }

  updateState(
    selection: string[],
    property: keyof typeof SchoolStateProperty
  ): void {
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
