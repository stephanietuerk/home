import { Pipe, type PipeTransform } from '@angular/core';
import { artHistoryFields } from './art-history-fields.constants';

@Pipe({
  name: 'appColorForField',
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
      case 'postdoc':
        return 'Postdoc';
      case 'lecturer':
        return 'Lecturer';
      case 'unknown':
      default:
        return 'Unknown';
    }
  }
}
