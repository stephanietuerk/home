import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonOption } from './button-group.model';

@Component({
    selector: 'app-button-group',
    templateUrl: './button-group.component.html',
    styleUrls: [],
})
export class ButtonGroupComponent implements OnInit {
    @Input() options: ButtonOption[];
    @Input() group: string;
    @Input() isStyledRadio: boolean = false;
    @Input() conditionalClassSetter: (option: ButtonOption, index: number) => string[] = () => {
        return [''];
    };
    previousSelection: string;
    @Output() newSelection = new EventEmitter();
    @Output() clicked = new EventEmitter();

    ngOnInit(): void {
        this.initializeSelection();
    }

    conditionalClasses(option: ButtonOption, index: number): string[] {
        const classArray = this.conditionalClassSetter(option, index);
        if (option.selected) {
            classArray.push('selected');
        }
        return classArray;
    }

    initializeSelection(): void {
        const selectedOption = this.options.find((option) => option.selected);
        if (selectedOption) {
            this.emitNewSelection(selectedOption);
        }
    }

    onSelect(option: ButtonOption): void {
        this.resetOptionsSelected();
        this.selectOption(option.label);
        this.emitNewSelection(option);
        this.clicked.emit();
    }

    resetOptionsSelected(): void {
        this.options.forEach((option) => {
            option.selected = false;
        });
    }

    selectOption(label: string): void {
        this.options.find((option) => option.label === label).selected = true;
    }

    emitNewSelection(option: ButtonOption): void {
        const selection = option.value ? option.value : option.label;
        this.newSelection.emit(selection);
    }
}
