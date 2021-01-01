import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BeyondResource {
    constructor(private http: HttpClient) {}

    getDistrictsData() {
        return this.http.get('assets/beyondthecountyline/districts_data.csv', { responseType: 'text' });
    }

    getTractData() {
        return this.http.get('assets/beyondthecountyline/censusTracts_data.csv', { responseType: 'text' });
    }

    getTractMap() {
        return this.http.get('assets/beyondthecountyline/PA_CensusTracts_2010.json', { responseType: 'json' });
    }

    getCitiesMap() {
        return this.http.get('assets/beyondthecountyline/PA_Cities.json', { responseType: 'json' });
    }
}
