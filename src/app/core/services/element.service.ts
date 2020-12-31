import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ElementService {
    constructor() {}

    scroll(
        id: string,
        behavior: 'smooth' | 'auto' = 'smooth',
        block: 'start' | 'center' | 'end' | 'nearest' = 'start'
    ): void {
        const element = document.getElementById(id);
        element.scrollIntoView({ block: block, behavior: behavior });
    }
}
