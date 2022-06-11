/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'as',
    pure: true,
})
export class AsPipe implements PipeTransform {
    transform<T>(value: any, _class: new (...args: any[]) => T): T {
        return value as T;
    }
}
