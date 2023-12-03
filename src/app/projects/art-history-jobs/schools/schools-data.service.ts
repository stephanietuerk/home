import { Injectable } from '@angular/core';
import { cloneDeep, isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
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
}

export interface SchoolsState {
  [SchoolStateProperty.field]: string[];
  [SchoolStateProperty.tenure]: string[];
  [SchoolStateProperty.rank]: string[];
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
  yearRange: string[];
  dataBySchool$: Observable<JobsByCountry[]>;
  private state: BehaviorSubject<SchoolsState> =
    new BehaviorSubject<SchoolsState>({
      field: this.fieldOptions.map((x) => x.name.full),
      tenure: this.tenureOptions.map((x) => x.label),
      rank: this.rankOptions.map((x) => x.label),
    });
  state$ = this.state.asObservable();

  constructor(
    public dataService: ArtHistoryDataService,
    private utilities: ArtHistoryDataService
  ) {}

  init(): void {
    const data$ = this.dataService.dataBySchool$.pipe(filter((x) => !!x));

    data$.pipe(take(1)).subscribe((data) => {
      this.yearRange = data[0].jobsBySchool[0].jobsByYear.map((x) => x.year);
    });

    this.dataBySchool$ = combineLatest([data$, this.state$]).pipe(
      map(([data, state]) => {
        console.log('data', data);
        console.log('fields', state.field);
        console.log('tenure', state.tenure);
        console.log('rank', state.rank);
        return this.filterDataForState(data, state);
      }),
      distinctUntilChanged((a, b) => isEqual(a, b)),
      shareReplay(1)
    );
  }

  filterDataForState(
    data: JobsByCountry[],
    state: SchoolsState
  ): JobsByCountry[] {
    let filteredData = cloneDeep(data);
    if (
      state.field.length !== this.fieldOptions.length ||
      state.tenure.length !== this.tenureOptions.length ||
      state.rank.length !== this.rankOptions.length
    ) {
      console.log('filtering', filteredData);
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
              // console.log('job', job);
              // console.log('tt', this.utilities.transformIsTt(job.isTt));
              // console.log(state.tenure);
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
              // console.log('inFields', inFields);
              // console.log('inTenure', inTenure);
              // console.log('inRank', inRank);
              return inFields && inTenure && inRank;
            });
          });
        });
        return country;
      });
    }
    console.log('filteredData', filteredData);
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
}
