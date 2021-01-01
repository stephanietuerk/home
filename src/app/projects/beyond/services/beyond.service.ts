import { Injectable } from '@angular/core';
import { BEYOND_DEMOTYPES, BEYOND_ELECTIONTYPES } from '../beyond.constants';
import { DemoData, MarginsData, TractData } from '../beyond.model';
import { BeyondResource } from '../resources/beyond.resource';

@Injectable({
    providedIn: 'root',
})
export class BeyondService {
    elId: string = '#beyond-vis';
    beyondTopojson: any;
    tractsData: TractData[];

    constructor(private beyondResource: BeyondResource) {}

    setBeyondData() {
        this.beyondResource.getTractData().subscribe((data) => {
            const csvToRowArray = data.split('\n');
            const header = csvToRowArray[0].split(',');
            const rows = csvToRowArray.slice(1);
            const raceVars = BEYOND_ELECTIONTYPES.map((o) => o.value);
            const demoVars = BEYOND_DEMOTYPES.map((o) => o.value);
            const dataArr = rows.map((row, i) => {
                const rowObj = new TractData();
                raceVars.forEach((race) => {
                    rowObj[race] = new MarginsData();
                });
                demoVars.forEach((demo) => {
                    rowObj[demo] = new DemoData();
                });
                const rowValues = row.split(',');
                rowValues.forEach((val, j) => {
                    const key = header[j];
                    if (typeof key !== 'undefined') {
                        if (key === 'tract') {
                            rowObj[key] = val;
                        } else {
                            const splitKey = key.split('_');
                            if (raceVars.includes(splitKey[0])) {
                                let year;
                                const race = splitKey[0].toLowerCase();
                                if (splitKey[1] === 'CHANGE') {
                                    year = 'change';
                                } else {
                                    year = `_${splitKey[2]}`;
                                }
                                rowObj[race][year] = +val;
                            } else {
                                let year;
                                const demo = Object.keys(rowObj).find(
                                    (k) => k.toLowerCase() === splitKey[0].toLowerCase()
                                );
                                if (splitKey[1] === 'CHANGE') {
                                    year = 'change';
                                } else {
                                    year = 'current';
                                }
                                rowObj[demo][year] = val === 'N/A' ? val : +val;
                            }
                        }
                    }
                });
                return rowObj;
            });
            this.tractsData = dataArr;
            console.log(this.tractsData);
        });
    }
}
