import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FlipResource {
    constructor(private http: HttpClient) {}

    getFlipData() {
        return this.http.get('assets/flipTheDistrict/flip_vote_data.csv', { responseType: 'text' });
    }

    getFlipTopoJson() {
        return this.http.get('assets/flipTheDistrict/pa_districts.json', { responseType: 'json' });
    }
}
