import { Component, Input, OnInit } from '@angular/core';
import { format } from 'd3';

@Component({
    selector: 'app-stacked-area-tooltip',
    templateUrl: './stacked-area-tooltip.component.html',
    styleUrls: ['./stacked-area-tooltip.component.scss'],
})
export class StackedAreaTooltipComponent implements OnInit {
    @Input() areas;
    @Input() xValue: string;
    @Input() top: number;
    @Input() left: number;
    @Input() format?: string = '.0f';
    @Input() width: number;

    constructor() {}

    ngOnInit(): void {}

    formatValue(value: number): string {
        return format(this.format)(value);
    }
}
