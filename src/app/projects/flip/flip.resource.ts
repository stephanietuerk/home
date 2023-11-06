import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PaMapTopology } from './flip.service';

@Injectable({
  providedIn: 'root',
})
export class FlipResource {
  constructor(private http: HttpClient) {}

  getFlipData() {
    return this.http.get('assets/flipthedistrict/flip_vote_data.csv', {
      responseType: 'text',
    });
  }

  getFlipTopoJson() {
    return this.http
      .get('assets/flipthedistrict/pa_districts.json')
      .pipe(map((response) => response as PaMapTopology));
  }
}
