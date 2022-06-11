import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentencecase',
})
export class SentenceCasePipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      const first = value.charAt(0).toUpperCase();
      const others = value.slice(1).toLowerCase();
      return `${first}${others}`;
    } else {
      return value;
    }
  }
}
