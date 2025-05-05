import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-form-select-with-filtering',
    imports: [CommonModule, MatAutocompleteModule, ReactiveFormsModule],
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
    ]
})
export class FormSelectWithFilteringComponent implements OnChanges {
  @Input() control: FormControl<string>;
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
  filteredOptions$: Observable<string[]>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.updateFilterOptionsForInput();
    }
  }

  updateFilterOptionsForInput(): void {
    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(''),
      map((inputValue: string) => {
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
