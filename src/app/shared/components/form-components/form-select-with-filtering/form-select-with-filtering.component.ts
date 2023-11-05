import {
  Component,
  Input,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';

@Component({
  selector: 'app-form-select-with-filtering',
  templateUrl: './form-select-with-filtering.component.html',
  styleUrls: [
    '../form-select/form-select.component.scss',
    './form-select-with-filtering.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormSelectWithFilteringComponent implements OnChanges {
  @Input() formControlName: string;
  @Input() options: string[];
  @Input() placeholder = '';
  @Input() textAlign?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
  @Input() overlayClass: string;
  filteredOptions: Observable<string[]>;

  constructor(@Self() @Optional() public ngControl: NgControl) {
    this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.updateFilterOptionsForInput();
    }
  }

  updateFilterOptionsForInput(): void {
    this.filteredOptions = this.ngControl.control.valueChanges.pipe(
      startWith(''),
      map((inputValue) => {
        return this.filterOptionsByInputValue(inputValue);
      })
    );
  }

  filterOptionsByInputValue(inputValue: string): string[] {
    const filterValue = this.normalizeValue(inputValue);
    return this.options.filter((option) =>
      this.optionIncludesInputValue(option, filterValue)
    );
  }

  optionIncludesInputValue(option: string, inputValue: string): boolean {
    return this.normalizeValue(option).includes(inputValue);
  }

  normalizeValue(option: string): string {
    return option.toLowerCase().replace(/\s/g, '');
  }
}
