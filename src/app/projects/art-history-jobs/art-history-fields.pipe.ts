import { Pipe, type PipeTransform } from '@angular/core';
import { format } from 'd3';
import { FormatSpecifier } from 'src/app/viz-components/value-format/value-format';
import { JobProperty, JobsBySchoolDatum } from './art-history-data.model';
import { artHistoryFields } from './art-history-fields.constants';
import { ArtHistoryUtilities } from './art-history.utilities';
import { EntityCategory } from './explore/explore-data.model';
import { SchoolsState } from './schools/schools-data.service';

@Pipe({
  name: 'appColorForField',
  standalone: true,
})
export class ColorForFieldPipe implements PipeTransform {
  transform(field: string): string {
    const fieldObj = artHistoryFields.find(
      (x) => x.name.full === field || x.name.short === field
    );
    return fieldObj.color;
  }
}

@Pipe({
  name: 'appTenureReadout',
  standalone: true,
})
export class TenureReadoutPipe implements PipeTransform {
  transform(tenure: string): string {
    if (tenure.toLowerCase() === 'true') {
      return 'Tenure track';
    } else if (tenure.toLowerCase() === 'false') {
      return 'Non-tenure track';
    } else {
      return 'Unknown tenure track status';
    }
  }
}

@Pipe({
  name: 'appRankReadout',
  standalone: true,
})
export class RankReadoutPipe implements PipeTransform {
  transform(rank: string): string {
    switch (rank) {
      case 'assistant_prof':
        return 'Assistant professor';
      case 'associate_prof':
        return 'Associate professor';
      case 'full_prof':
        return 'Full professor';
      case 'chair':
        return 'Chair';
      case 'open_rank':
        return 'Open rank';
      case 'vap':
        return 'Visiting assistant professor';
      case 'lecturer':
        return 'Lecturer';
      case 'unknown':
      default:
        return 'Unknown';
    }
  }
}

@Pipe({
  name: 'appJobIsInFilters',
  standalone: true,
})
export class JobIsInFiltersPipe implements PipeTransform {
  transform(job: JobsBySchoolDatum, state: SchoolsState): boolean {
    return ArtHistoryUtilities.jobInFilters(job, state);
  }
}

@Pipe({
  name: 'appCategoryLabel',
  standalone: true,
})
export class CategoryLabelPipe implements PipeTransform {
  transform(category: EntityCategory, pluralize = false): string {
    if (category === JobProperty.field) {
      return pluralize ? 'Fields' : 'Field';
    } else if (category === JobProperty.tenure) {
      return pluralize ? 'Tenure statuses' : 'Tenure status';
    } else if (category === JobProperty.rank) {
      return pluralize ? 'Ranks' : 'Rank';
    } else {
      return '';
    }
  }
}

@Pipe({
  name: 'appD3FormatPipe',
  standalone: true,
})
export class D3FormatPipe implements PipeTransform {
  transform(value: number, formatSpec: FormatSpecifier): string {
    if (typeof formatSpec === 'string') {
      return format(formatSpec)(value);
    } else {
      return formatSpec(value);
    }
  }
}

@Pipe({
  name: 'appUniqueValues',
  standalone: true,
})
export class UniqueValuesPipe implements PipeTransform {
  transform(values: string[]): string[] {
    return [...new Set(values)];
  }
}
