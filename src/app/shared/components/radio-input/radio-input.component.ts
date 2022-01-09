import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ButtonOption } from '../button-group/button-group.model';

let nextUniqueId = 0;

@Component({
    selector: 'app-radio-input',
    templateUrl: './radio-input.component.html',
    styleUrls: ['./radio-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RadioInputComponent implements OnInit {
    private _uniqueId = `st-radio-input-${++nextUniqueId}`;
    @Input() id: string = this._uniqueId;
    @Input() option: ButtonOption;
    @Input() group;
    @Input() isStyledRadio: boolean;

    @Output() selection = new EventEmitter();
    uniqueId: string;

    ngOnInit(): void {
        this.uniqueId = this.getId();
    }

    getId(): string {
        return `${this.id || this._uniqueId}-input`;
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
