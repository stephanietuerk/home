import { Directive, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DataMarksConfig } from 'src/app/shared/components/charts/data-marks/data-marks.model';
import { ValueType } from '../../art-history-jobs.constants';

@Directive()
export abstract class ExploreChart implements OnInit, OnChanges {
    @Input() chart: any;
    dataMarksConfig: DataMarksConfig;

    constructor(public utilities: UtilitiesService) {}

    ngOnInit(): void {
        this.setChartProperties();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.utilities.objectChangedNotFirstTime(changes, 'chart')) {
            this.setChartProperties();
        }
    }

    setChartProperties(): void {
        this.dataMarksConfig = this.getNewDataMarksConfig();
    }

    getQuantitativeDomain(): any {
        return this.chart.valueType === ValueType.percent ? [0, 1] : undefined;
    }

    // getQuantitativeValueFormat(): string {
    //     return this.getFormatFromChartFormatConstants(formatSpecifications.dashboard.chart.value);
    // }

    // getQuantitativeTickFormat(): string {
    //     return this.getFormatFromChartFormatConstants(formatSpecifications.dashboard.chart.tick);
    // }

    // getFormatFromChartFormatConstants(formatObject: ChartFormat) {
    //     const valueFormat = valueTypeValueFormats[this.chart.valueType];
    //     return formatObject[valueFormat];
    // }

    abstract getNewDataMarksConfig(): any;
}
