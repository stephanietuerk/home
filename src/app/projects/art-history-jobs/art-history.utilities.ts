import { JobProperty, JobsBySchoolDatum } from './art-history-data.model';
import {
  artHistoryFields,
  rankOptions,
  tenureOptions,
} from './art-history-fields.constants';
import { EntityCategory } from './explore/explore-data.model';
import { SchoolsState } from './schools/schools-data.service';

export class ArtHistoryUtilities {
  static sentenceCase<T>(value: T): string | T {
    if (typeof value === 'string') {
      const first = value.charAt(0).toUpperCase();
      const others = value.slice(1).toLowerCase();
      return `${first}${others}`;
    } else {
      return value;
    }
  }

  static transformIsTt(isTt: string): string {
    if (isTt.toLowerCase() === 'true') {
      return tenureOptions[0].label;
    } else if (isTt.toLowerCase() === 'false') {
      return tenureOptions[1].label;
    } else if (isTt.toLowerCase() === 'unknown') {
      return tenureOptions[2].label;
    } else {
      return this.sentenceCase(isTt);
    }
  }

  static transformRankMulti(rank: string): string[] {
    const transformedRank = rank.split(', ');
    return transformedRank.map((str) => this.transformRank(str));
  }

  static transformRank(rank: string): string {
    switch (rank) {
      case 'assistant_prof':
        return rankOptions[0].label;
      case 'associate_prof':
        return rankOptions[1].label;
      case 'full_prof':
        return rankOptions[2].label;
      case 'chair':
        return rankOptions[3].label;
      case 'open_rank':
        return rankOptions[4].label;
      case 'vap':
        return rankOptions[5].label;
      case 'lecturer':
        return rankOptions[6].label;
      case 'unknown':
        return rankOptions[7].label;
      default:
        return this.sentenceCase(rank);
    }
  }

  static jobInFilters(job: JobsBySchoolDatum, state: SchoolsState): boolean {
    const inFields =
      state.field.length !== artHistoryFields.length
        ? state.field.some((field) => {
            return job.field.includes(field);
          })
        : true;
    const inTenure =
      state.tenure.length !== tenureOptions.length
        ? state.tenure.includes(ArtHistoryUtilities.transformIsTt(job.tenure))
        : true;
    const inRank =
      state.rank.length !== rankOptions.length
        ? state.rank.some((rank) => {
            return job.rank
              .map((x) => ArtHistoryUtilities.transformRank(x))
              .includes(rank);
          })
        : true;
    return inFields && inTenure && inRank;
  }

  static getCategoryLabel(entityCategory: EntityCategory): string {
    if (entityCategory === JobProperty.field) {
      return 'Field';
    } else if (entityCategory === JobProperty.tenure) {
      return 'Tenure status';
    } else if (entityCategory === JobProperty.rank) {
      return 'Rank';
    } else {
      return '';
    }
  }
}
