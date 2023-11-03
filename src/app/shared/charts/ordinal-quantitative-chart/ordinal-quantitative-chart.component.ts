import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chart } from '../chart/chart';
import { ChartComponent } from '../chart/chart.component';

@Component({
    selector: 'app-ordinal-quantitative-chart',
    templateUrl: '../chart/chart.component.html',
    styleUrls: ['../chart/chart.component.scss'],
})
export class OrdinalQuantitativeChartComponent extends ChartComponent implements Chart, OnInit {
    private ordinalScale: BehaviorSubject<any> = new BehaviorSubject(null);
    ordinalScale$ = this.ordinalScale.asObservable();
    private quantitativeScale: BehaviorSubject<any> = new BehaviorSubject(null);
    quantitativeScale$ = this.quantitativeScale.asObservable();
    private categoryScale: BehaviorSubject<any> = new BehaviorSubject(null);
    categoryScale$ = this.categoryScale.asObservable();

    updateOrdinalScale(scale: any): void {
        this.ordinalScale.next(scale);
    }

    updateQuantitativeScale(scale: any): void {
        this.quantitativeScale.next(scale);
    }

    updateCategoryScale(scale: any): void {
        this.categoryScale.next(scale);
    }
}
