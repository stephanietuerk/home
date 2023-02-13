import { Directive } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { Unsubscribe } from '../../unsubscribe.directive';
import { AttributeDataDimensionConfig } from '../geographies/geographies.config';
import { MapChartComponent } from './map-chart.component';

@Directive()
export abstract class MapContent extends Unsubscribe {
    attributeDataScale: any;
    attributeDataConfig: AttributeDataDimensionConfig;

    constructor(public chart: MapChartComponent) {
        super();
    }

    subscribeToScalesAndConfig(): void {
        const subscriptions = [this.chart.attributeDataScale$, this.chart.attributeDataConfig$];

        combineLatest(subscriptions)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([scale, config]) => {
                this.setScaleAndConfig(scale, config);
            });
    }

    abstract setScaleAndConfig(scale: any, config: AttributeDataDimensionConfig): void;
}
