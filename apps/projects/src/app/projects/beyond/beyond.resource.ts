import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BeyondResource {
  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTractData(): Observable<any> {
    return this.http.get('assets/beyond/censusTractData.csv', {
      responseType: 'text',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTractMap(): Observable<any> {
    return this.http.get('assets/beyond/PA_CensusTracts_2010.json', {
      responseType: 'json',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCitiesMap(): Observable<any> {
    return this.http.get('assets/beyond/PA_Cities.json', {
      responseType: 'json',
    });
  }
}
