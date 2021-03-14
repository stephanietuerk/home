import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { DemoData, MarginsData, TractDatum, TractObject } from '../models/beyond-data.model';
import {
    CensusVariable,
    CensusVariableOption,
    ElectionType,
    ElectionTypeOption,
    ElectionYear,
    ElectionYearOption,
} from '../models/beyond-enums.model';
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
        this.initState();
    }

    initState(): void {
        this._state.electionType = ElectionType.president;
        this._state.electionYear = ElectionYear._2016;
        this._state.demoType = CensusVariable.populationDensity;
        this._state.demoIsChange = false;
        this.state$.next(this._state);
    }

    updateState(
        key: ElectionTypeOption | ElectionYearOption | CensusVariableOption | 'demoIsChange',
        value: string | boolean
    ): void {
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
        president[2012] = obj.USP_2012;
        president[2016] = obj.USP_2016;
        president.change = obj.USP_CHANGE;
        datum.president = president;

        const senate = new MarginsData();
        senate[2012] = obj.USS_2012;
        senate[2016] = obj.USS_2016;
        senate.change = obj.USS_CHANGE;
        datum.senate = senate;

        const house = new MarginsData();
        house[2012] = obj.USC_2012;
        house[2016] = obj.USC_2016;
        house.change = obj.USC_CHANGE;
        datum.house = house;

        const popDensity = new DemoData();
        popDensity.current = obj.POPDENSITY_2015;
        popDensity.change = obj.POPDENSITY_CHANGE;
        datum.populationDensity = popDensity;

        const nonWhite = new DemoData();
        nonWhite.current = obj.NONWHITE_2015;
        nonWhite.change = obj.NONWHITE_CHANGE;
        datum.nonWhite = nonWhite;

        const unemployment = new DemoData();
        unemployment.current = obj.UNEMPLOYMENT_2015;
        unemployment.change = obj.UNEMPLOYMENT_CHANGE;
        datum.unemployment = unemployment;

        const college = new DemoData();
        college.current = obj.COLLEGE_2015;
        college.change = obj.COLLEGE_CHANGE;
        datum.college = college;

        const income = new DemoData();
        income.current = obj.INCOME_2015;
        income.change = obj.INCOME_CHANGE;
        datum.income = income;

        return datum;
    }
}
