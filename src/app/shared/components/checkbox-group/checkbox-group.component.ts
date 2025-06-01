import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxInputComponent } from '../checkbox-input/checkbox-input.component';
import { InputOption } from '../input-option.model';

@Component({
  selector: 'app-checkbox-group',
  imports: [CommonModule, CheckboxInputComponent],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent implements OnInit {
  @Input() options: InputOption[];
  @Input() group: string;
  @Input() isStyledCheckbox = false;
  @Input() conditionalClassSetter: (
    option: InputOption,
    index: number
  ) => string[] = () => {
    return [''];
  };
  @Output() newSelection: EventEmitter<string[]> = new EventEmitter();
  @Output() clicked: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
    this.emitSelections();
  }

  conditionalClasses(option: InputOption, index: number): string[] {
    const classArray = this.conditionalClassSetter(option, index);
    if (option.selected) {
      classArray.push('selected');
    }
    return classArray;
  }

  onSelect(): void {
    this.emitSelections();
    this.clicked.emit();
  }

  emitSelections(): void {
    const selected = this.options
      .filter((option) => option.selected)
      .map((option) => option.value ?? option.label);
    this.newSelection.emit(selected);
  }
}
