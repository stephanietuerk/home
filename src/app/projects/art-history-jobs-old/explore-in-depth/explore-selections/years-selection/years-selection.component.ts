import { Component, ElementRef, Input, OnInit, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { format } from 'd3';
import noUiSlider from 'nouislider';
import { takeUntil } from 'rxjs/operators';
import { NOOP_VALUE_ACCESSOR } from 'src/app/shared/components/form-components/forms.constants';
import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';
import { YearsSelection } from '../../../models/art-history-config';

@Component({
    selector: 'app-years-selection',
    templateUrl: './years-selection.component.html',
    styleUrls: ['../../../styles/art-history-jobs.scss', './years-selection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class YearsSelectionComponent extends UnsubscribeDirective implements OnInit {
    @Input() years: [number, number];
    @Input() formControlName: string;
    @ViewChild('slider', { static: true }) slider: ElementRef;

    constructor(@Self() @Optional() public ngControl: NgControl) {
        super();
        this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }

    ngOnInit(): void {
        this.setFormListener();
    }

    setFormListener(): void {
        this.ngControl.control.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            if (!this.slider.nativeElement.noUiSlider) {
                this.createSlider();
                this.setSliderListener();
            } else {
                this.slider.nativeElement.noUiSlider.set([
                    this.ngControl.control.value.start,
                    this.ngControl.control.value.end,
                ]);
            }
        });
    }

    createSlider() {
        noUiSlider.create(this.slider.nativeElement, {
            start: [this.ngControl.control.value.start, this.ngControl.control.value.end],
            connect: true,
            range: {
                min: this.years[0],
                max: this.years[1],
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
    }

    setSliderListener(): void {
        this.slider.nativeElement.noUiSlider.on('set', (values: number[]) => {
            const selections: YearsSelection = {
                start: +values[0],
                end: +values[1],
            };
            this.ngControl.control.setValue(selections);
        });
    }
}
