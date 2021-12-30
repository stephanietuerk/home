import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BeyondResource {
    constructor(private http: HttpClient) {}

    getTractData(): Observable<any> {
        return this.http.get('assets/beyond/censusTractData.csv', { responseType: 'text' });
    }

    getTractMap(): Observable<any> {
        return this.http.get('assets/beyond/PA_CensusTracts_2010.json', { responseType: 'json' });
    }

    getCitiesMap(): Observable<any> {
        return this.http.get('assets/beyond/PA_Cities.json', { responseType: 'json' });
    }
}
