import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { format } from 'd3';
import noUiSlider from 'nouislider';
import { ArtHistoryJobsService } from '../../../art-history-jobs.service';
import { YearsSelection } from '../../../models/art-history-config';

@Component({
    selector: 'app-years-selection',
    templateUrl: './years-selection.component.html',
    styleUrls: ['../../../styles/art-history-jobs.scss', './years-selection.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class YearsSelectionComponent implements OnInit {
    @ViewChild('slider', { static: true }) slider: ElementRef;
    constructor(private service: ArtHistoryJobsService) {}

    ngOnInit(): void {
        this.createSlider();
    }

    createSlider() {
        noUiSlider.create(this.slider.nativeElement, {
            start: [2011, 2021],
            connect: true,
            range: {
                min: 2011,
                max: 2021,
            },
            step: 1,
            margin: 1,
            tooltips: true,
            format: {
                to: (value: number) => format('.0f')(value),
                from: (value: string) => +value,
            },
            handleAttributes: [{ 'aria-label': 'lower year handle' }, { 'aria-label': 'upper year handle' }],
            pips: {
                mode: 'steps' as any,
                density: 0,
                filter: (value: number, type: number) => {
                    if ((value * 10) % 10 === 0) {
                        return 2;
                    } else {
                        return -1;
                    }
                },
            },
        });
        this.slider.nativeElement.classList.add('noUi-art-history');
        this.slider.nativeElement.noUiSlider.on('set', (values: number[]) => {
            const selections: YearsSelection = {
                start: +values[0],
                end: +values[1],
            };
            this.service.updateYearsSelections(selections);
        });
    }
}
