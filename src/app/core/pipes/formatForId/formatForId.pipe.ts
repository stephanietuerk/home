import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatForId' })
export class FormatForIdPipe implements PipeTransform {
    transform(value: string): string {
        if (typeof value === 'string') {
            return value.replace(/ /g, '-').toLowerCase();
        }
    }
}
