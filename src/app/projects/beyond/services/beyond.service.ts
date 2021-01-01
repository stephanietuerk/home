import { Injectable } from '@angular/core';
import { BeyondResource } from '../resources/beyond.resource';

@Injectable({
    providedIn: 'root',
})
export class BeyondService {
    elId: string = '#beyond-vis';
    beyondTopojson: any;
    districtsData: any;
    tractsData: any;

    constructor(private beyondResource: BeyondResource) {}

    setBeyondData() {
        this.beyondResource.getDistrictsData().subscribe((data) => {
            const csvToRowArray = data.split('\n');
            const header = csvToRowArray[0].split(',');
            const rows = csvToRowArray.slice(1);
            const dataArr = rows.map((row, i) => {});
        });
    }
}
