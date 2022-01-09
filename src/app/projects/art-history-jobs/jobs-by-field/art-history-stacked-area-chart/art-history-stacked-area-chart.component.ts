import { Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { StackedAreaChartComponent } from 'src/app/shared/components/stacked-area-chart/stacked-area-chart.component';

@Component({
    selector: 'app-art-history-stacked-area-chart',
    templateUrl: '../../../../shared/components/stacked-area-chart/stacked-area-chart.component.html',
    styleUrls: [
        '../../../../shared/components/stacked-area-chart/stacked-area-chart.component.scss',
        './art-history-stacked-area-chart.component.scss',
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ArtHistoryStackedAreaChartComponent extends StackedAreaChartComponent implements OnInit, OnChanges {
    constructor() {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.order && !changes.order.firstChange) {
            this.updateChartForOrder();
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    updateChartForOrder(): void {
        this.removeChart();
        this.setChartMethods();
        this.createChart();
    }
}
