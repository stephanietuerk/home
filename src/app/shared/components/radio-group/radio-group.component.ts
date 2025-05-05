import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputOption } from '../input-option.model';
import { RadioInputComponent } from '../radio-input/radio-input.component';

@Component({
    selector: 'app-radio-group',
    imports: [CommonModule, RadioInputComponent],
    templateUrl: './radio-group.component.html',
    styleUrls: []
})
export class RadioGroupComponent implements OnInit {
  @Input() options: InputOption[];
  @Input() group: string;
  @Input() isStyledRadio = false;
  @Input() conditionalClassSetter: (
    option: InputOption,
    index: number
  ) => string[] = () => {
    return [''];
  };
  @Output() newSelection: EventEmitter<string> = new EventEmitter();
  @Output() clicked: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
    this.initializeSelection();
  }

  conditionalClasses(option: InputOption, index: number): string[] {
    const classArray = this.conditionalClassSetter(option, index);
    if (option.selected) {
      classArray.push('selected');
    }
    return classArray;
  }

  initializeSelection(): void {
    this.validateOptionSelections();
    const selection = this.options.find((option) => option.selected);
    if (selection) {
      this.emitNewSelection(selection);
    }
  }

  validateOptionSelections(): void {
    const firstSelectedOption = this.options.find((option) => option.selected);
    if (this.options.filter((option) => option.selected).length > 1) {
      this.resetOptionsSelected();
      this.selectOption(firstSelectedOption);
    }
  }

  onSelect(option: InputOption): void {
    this.resetOptionsSelected();
    this.selectOption(option);
    this.emitNewSelection(option);
    this.clicked.emit();
  }

  resetOptionsSelected(): void {
    this.options.forEach((option) => {
      option.selected = false;
    });
  }

  selectOption(option: InputOption): void {
    option.selected = true;
  }

  emitNewSelection(option: InputOption): void {
    const selection = option.value ?? option.label;
    this.newSelection.emit(selection);
  }
}
