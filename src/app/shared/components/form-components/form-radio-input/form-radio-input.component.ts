import { Component, Input, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';
import { SelectionOption } from './form-radio-input.model';

let nextUniqueId = 0;

@Component({
    selector: 'app-form-radio-input',
    templateUrl: './form-radio-input.component.html',
    styleUrls: ['./form-radio-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class FormRadioInputComponent extends Unsubscribe implements OnInit, OnDestroy {
    _uniqueId = ++nextUniqueId;
    @Input() formControlName: string;
    @Input() option: SelectionOption;
    @Input() id?: string;
    @Input() isStyledRadio?: boolean = false;
    @Input() disabledMessage: string;
    uniqueId: string;
    label: string;
    value: string | number;
    selected: boolean;

    constructor(@Self() @Optional() public ngControl: NgControl) {
        super();
        this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }

    ngOnInit(): void {
        this.setUniqueId();
        this.parseOption();
        this.setSelected();
        this.setFormListener();
    }

    setUniqueId(): void {
        this.uniqueId = this.id || `smt-radio-input-${this._uniqueId}`;
    }

    parseOption(): void {
        this.label = this.option.label;
        this.value = this.option.value ?? this.option.label;
    }

    setSelected(): void {
        this.selected = this.ngControl.control.value === this.value;
    }

    setFormListener(): void {
        this.ngControl.control.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.setSelected();
        });
    }

    getIconName(): string {
        return this.isStyledRadio && this.selected ? 'radio-selected' : 'radio-unselected';
    }
}
