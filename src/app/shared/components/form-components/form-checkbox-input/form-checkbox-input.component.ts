import {
  Component,
  Input,
  OnInit,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { SelectionOption } from '../form-radio-input/form-radio-input.model';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';

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
  @Input() formControlName: string;
  @Input() id: string;
  @Input() option: SelectionOption;
  @Input() isStyledCheckbox: boolean;
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
    this.uniqueId = this.id || `smt-checkbox-input-${this._uniqueId}`;
  }

  parseOption(): void {
    this.label = this.option.label;
    this.value = this.option.value ?? this.option.label;
  }

  setSelected(): void {
    this.selected = this.ngControl.control.value;
  }

  setFormListener(): void {
    this.ngControl.control.valueChanges
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

  updateChecked(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const value = checked
      ? [...this.ngControl.control.value, this.value]
      : this.ngControl.control.value.filter((v) => v !== this.value);
    this.ngControl.control.setValue(value);
  }
}
