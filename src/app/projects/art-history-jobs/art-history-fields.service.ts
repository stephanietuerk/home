import { Injectable } from '@angular/core';
import { artHistoryFields } from './art-history-fields.constants';

@Injectable({
    providedIn: 'root',
})
export class ArtHistoryFieldsService {
    constructor() {}

    getColorForField(field: string): string {
        return artHistoryFields.find((x) => x.name.full === field || x.name.short === field).color;
    }
}
