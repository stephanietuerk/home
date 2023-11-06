import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatForId' })
export class FormatForIdPipe<T> implements PipeTransform {
  transform(value: T): string | T {
    if (typeof value === 'string') {
      return value.replace(/ /g, '-').toLowerCase();
    } else {
      return value;
    }
  }
}
