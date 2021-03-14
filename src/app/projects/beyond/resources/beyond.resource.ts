import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BeyondResource {
    constructor(private http: HttpClient) {}

    getTractData(): Observable<any> {
        console.log('getTraceData resource');
        return this.http.get('assets/beyondthecountyline/censusTractData.csv', { responseType: 'text' });
    }

    getTractMap(): Observable<any> {
        return this.http.get('assets/beyondthecountyline/PA_CensusTracts_2010.json', { responseType: 'json' });
    }

    getCitiesMap(): Observable<any> {
        return this.http.get('assets/beyondthecountyline/PA_Cities.json', { responseType: 'json' });
    }
}
