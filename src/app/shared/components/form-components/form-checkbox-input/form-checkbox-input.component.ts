import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { SelectionOption } from '../form-radio-input/form-radio-input.model';

let nextUniqueId = 0;

@Component({
  selector: 'app-form-checkbox-input',
  templateUrl: './form-checkbox-input.component.html',
  styleUrls: ['./form-checkbox-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormCheckboxInputComponent extends Unsubscribe implements OnInit {
  _uniqueId = ++nextUniqueId;
  @Input() control: FormControl<boolean>;
  @Input() id: string;
  @Input() option: SelectionOption;
  @Input() isStyledCheckbox: boolean;
  uniqueId: string;
  label: string;
  value: string | number;
  selected: boolean;

  ngOnInit(): void {
    this.setUniqueId();
    this.parseOption();
    this.setSelected();
    this.setFormListener();
  }

  setUniqueId(): void {
    this.uniqueId = this.id || `smt-checkbox-input-${this._uniqueId}`;
  }

  parseOption(): void {
    this.label = this.option.label;
    this.value = this.option.value ?? this.option.label;
  }

  setSelected(): void {
    this.selected = this.control.value;
  }

  setFormListener(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.setSelected();
      });
  }

  getIconName(): string {
    return this.isStyledCheckbox && this.selected
      ? 'checkbox-selected'
      : 'checkbox-unselected';
  }
}
