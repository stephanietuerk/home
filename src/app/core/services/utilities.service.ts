import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    constructor() {}

    interpolateNumber(a, b) {
        return function (t) {
            return a + t * (b - a);
        };
    }
}
