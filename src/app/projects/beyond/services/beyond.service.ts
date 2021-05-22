import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { DemoData, MarginsData, TractDatum, TractObject } from '../models/beyond-data.model';
import { DemoVariable, ElectionType, ElectionYear } from '../models/beyond-enums.model';
import { BeyondState } from '../models/beyond-state.model';
import { BeyondResource } from '../resources/beyond.resource';

@Injectable()
export class BeyondService {
    elId: string = '#beyond-vis';
    tractsTopojson: any;
    citiesTopojson: any;
    tractData: any;
    _state: BeyondState = new BeyondState();
    state$: BehaviorSubject<BeyondState> = new BehaviorSubject(null);
    state = this.state$.asObservable();

    constructor(private beyondResource: BeyondResource) {
        // this.initState();
    }

    initState(): void {
        this._state.electionType = ElectionType.president;
        this._state.electionYear = ElectionYear._2016;
        this._state.demoType = DemoVariable.populationDensity;
        this._state.demoIsChange = false;
        this.state$.next(this._state);
    }

    updateState(key: string, value: string | boolean): void {
        this._state[key] = value;
        this.state$.next(this._state);
    }

    getBeyondData(): Promise<void> {
        return new Promise((resolve, reject) => {
            forkJoin([
                this.beyondResource.getTractData(),
                this.beyondResource.getTractMap(),
                this.beyondResource.getCitiesMap(),
            ]).subscribe((groups) => {
                this.tractData = this.getTractData(groups[0]);
                this.tractsTopojson = groups[1];
                this.citiesTopojson = groups[2];
                resolve();
            });
        });
    }

    getTractData(data): TractObject {
        return csvParse(data).reduce((acc, x) => {
            const datum = this.makeTractDatum(x);
            acc[x.tract] = datum;
            return acc;
        }, {});
    }

    makeTractDatum(obj: any): TractDatum {
        const datum = new TractDatum();

        const president = new MarginsData();
        president[2012] = this.getNumber(obj.USP_2012);
        president[2016] = this.getNumber(obj.USP_2016);
        president.change = this.getNumber(obj.USP_CHANGE);
        datum.president = president;

        const senate = new MarginsData();
        senate[2012] = this.getNumber(obj.USS_2012);
        senate[2016] = this.getNumber(obj.USS_2016);
        senate.change = this.getNumber(obj.USS_CHANGE);
        datum.senate = senate;

        const house = new MarginsData();
        house[2012] = this.getNumber(obj.USC_2012);
        house[2016] = this.getNumber(obj.USC_2016);
        house.change = this.getNumber(obj.USC_CHANGE);
        datum.house = house;

        const popDensity = new DemoData();
        popDensity.current = this.getNumber(obj.POPDENSITY_2015);
        popDensity.change = this.getNumber(obj.POPDENSITY_CHANGE);
        datum.populationDensity = popDensity;

        const nonWhite = new DemoData();
        nonWhite.current = this.getNumber(obj.NONWHITE_2015);
        nonWhite.change = this.getNumber(obj.NONWHITE_CHANGE);
        datum.nonWhite = nonWhite;

        const unemployment = new DemoData();
        unemployment.current = this.getNumber(obj.UNEMPLOYMENT_2015);
        unemployment.change = this.getNumber(obj.UNEMPLOYMENT_CHANGE);
        datum.unemployment = unemployment;

        const college = new DemoData();
        college.current = this.getNumber(obj.COLLEGE_2015);
        college.change = this.getNumber(obj.COLLEGE_CHANGE);
        datum.college = college;

        const income = new DemoData();
        income.current = this.getNumber(obj.INCOME_2015);
        income.change = this.getNumber(obj.INCOME_CHANGE);
        datum.income = income;

        return datum;
    }

    getNumber(str): number {
        if (str === 'null') {
            return null;
        } else {
            return +str;
        }
    }
}
