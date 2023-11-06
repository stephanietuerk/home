import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentencecase',
})
export class SentenceCasePipe<T> implements PipeTransform {
  transform(value: T): string | T {
    if (typeof value === 'string') {
      const first = value.charAt(0).toUpperCase();
      const others = value.slice(1).toLowerCase();
      return `${first}${others}`;
    } else {
      return value;
    }
  }
}
