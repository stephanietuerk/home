import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { InputOption } from '../input-option.model';

let nextUniqueId = 0;

@Component({
    selector: 'app-radio-input',
    templateUrl: './radio-input.component.html',
    styleUrls: ['./radio-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RadioInputComponent implements OnInit {
    private _uniqueId = `${++nextUniqueId}`;
    @Input() id: string;
    @Input() option: InputOption;
    @Input() group;
    @Input() isStyledRadio: boolean;

    @Output() selection = new EventEmitter();
    uniqueId: string;

    ngOnInit(): void {
        this.getId();
    }

    getId(): void {
        this.uniqueId = `st-radio-input-${this.id || this._uniqueId}`;
    }

    onClick(): void {
        if (!this.option.selected) {
            this.selection.emit();
        }
    }

    getIconName(): string {
        return this.isStyledRadio && this.option.selected ? 'radio-selected' : 'radio-unselected';
    }
}
