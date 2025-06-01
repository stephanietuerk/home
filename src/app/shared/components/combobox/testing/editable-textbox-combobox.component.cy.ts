/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

interface ViewModel<ListboxSelection> {
  options: { displayName: string; id: string }[];
  selected: ListboxSelection;
}

@Component({
  selector: 'app-editable-textbox-combobox',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="textbox-value">{{ textboxValue$ | async }}</p>
    <p class="combobox-value">{{ value$ | async }}</p>
    @if (vm$ | async; as vm) {
      <app-combobox class="fruits-dropdown">
        <app-combobox-label>
          <span>Fruits</span>
        </app-combobox-label>
        <app-editable-textbox
          placeholder="Select a fruit, A-E"
          [autoSelectTrigger]="autoSelectTrigger"
          [autoSelect]="autoSelect"
          (valueChanges)="onTyping($event)"
        >
        </app-editable-textbox>
        <app-listbox
          (valueChanges)="onSelection($event)"
          [isMultiSelect]="isMultiSelect"
        >
          <app-listbox-label>
            <span>Select a fruit</span>
          </app-listbox-label>
          @for (option of vm.options; track option.id) {
            @if (isMultiSelect) {
              <app-listbox-option
                [selected]="vm.selected.includes(option.displayName)"
                >{{ option.displayName }}</app-listbox-option
              >
            } @else {
              <app-listbox-option
                [selected]="vm.selected === option.displayName"
                >{{ option.displayName }}</app-listbox-option
              >
            }
          }
        </app-listbox>
      </app-combobox>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class EditableTextboxTestComponent
  extends ComboboxBaseTestComponent
  implements OnInit
{
  @Input() autoSelect: boolean;
  @Input() autoSelectTrigger: 'any' | 'character';
  @Input() dynamicLabel = false;
  @Input() isMultiSelect = false;
  vm$: Observable<ViewModel<string[]> | ViewModel<string>>;
  textboxValue = new BehaviorSubject<string>('');
  textboxValue$ = this.textboxValue.asObservable();

  ngOnInit(): void {
    this.value.next(this.isMultiSelect ? [] : '');
    this.vm$ = combineLatest([this.textboxValue$, this.value$]).pipe(
      map(([inputValue, listboxValue]) => {
        if (this.isMultiSelect) {
          return {
            options: this.getMultiSelectOptions(inputValue),
            selected: listboxValue as string[],
          };
        } else {
          return {
            options: this.getSingleSelectOptions(
              inputValue,
              listboxValue as string
            ),
            selected: listboxValue as string,
          };
        }
      })
    );
  }

  getSingleSelectOptions(
    inputValue: string,
    listboxValue: string
  ): { displayName: string; id: string }[] {
    const selected = this.options.filter((x) => listboxValue.includes(x.id));
    return this.options.filter((option) => {
      if (selected.length && inputValue === selected[0].displayName) {
        return listboxValue.includes(option.displayName);
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  getMultiSelectOptions(
    inputValue: string
  ): { displayName: string; id: string }[] {
    return this.options.filter((option) => {
      if (inputValue === '') {
        return true;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  optionIncludesSearchText(
    option: { displayName: string; id: string },
    value: string
  ): boolean {
    return option.displayName.toLowerCase().includes(value?.toLowerCase());
  }

  onTyping(value: any): void {
    this.textboxValue.next(value);
  }
}

@Component({
  selector: 'app-editable-textbox-form-control-combobox',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="textbox-value">{{ searchFormControl.valueChanges | async }}</p>
    <p class="combobox-value">{{ comboboxValue$ | async }}</p>
    @if (vm$ | async; as vm) {
      <app-combobox class="fruits-dropdown">
        <app-combobox-label>
          <span>Fruits</span>
        </app-combobox-label>
        <app-editable-textbox
          placeholder="Select a fruit, A-E"
          [autoSelectTrigger]="autoSelectTrigger"
          [autoSelect]="autoSelect"
          [ngFormControl]="searchFormControl"
        >
        </app-editable-textbox>
        <app-listbox
          [ngFormControl]="listboxFormControl"
          [isMultiSelect]="isMultiSelect"
        >
          <app-listbox-label>
            <span>Select a fruit</span>
          </app-listbox-label>
          @for (option of vm.options; track option.id) {
            @if (isMultiSelect) {
              <app-listbox-option
                [selected]="vm.selected.includes(option.displayName)"
                >{{ option.displayName }}</app-listbox-option
              >
            } @else {
              <app-listbox-option
                [selected]="vm.selected === option.displayName"
                >{{ option.displayName }}</app-listbox-option
              >
            }
          }
        </app-listbox>
      </app-combobox>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class EditableTextboxFormControlTestComponent
  extends ComboboxBaseTestComponent
  implements OnInit
{
  @Input() autoSelect: boolean;
  @Input() autoSelectTrigger: 'any' | 'character';
  @Input() dynamicLabel = false;
  @Input() isMultiSelect = false;
  vm$: Observable<ViewModel<string[]> | ViewModel<string>>;
  listboxFormControl: FormControl<string | string[]>;
  searchFormControl = new FormControl<string>('');
  comboboxValue$: Observable<string | string[]>;

  ngOnInit(): void {
    if (this.isMultiSelect) {
      this.listboxFormControl = new FormControl<string[]>([]);
    } else {
      this.listboxFormControl = new FormControl<string>('');
    }

    this.comboboxValue$ = this.listboxFormControl.valueChanges;

    const listboxValues$ = this.isMultiSelect
      ? this.listboxFormControl.valueChanges.pipe(startWith([] as string[]))
      : this.listboxFormControl.valueChanges.pipe(startWith(''));

    this.vm$ = combineLatest([
      this.searchFormControl.valueChanges.pipe(startWith('')),
      listboxValues$,
    ]).pipe(
      map(([inputValue, listboxValue]) => {
        if (this.isMultiSelect) {
          return {
            options: this.getMultiSelectOptions(inputValue),
            selected: listboxValue as string[],
          };
        } else {
          return {
            options: this.getSingleSelectOptions(
              inputValue,
              listboxValue as string
            ),
            selected: listboxValue as string,
          };
        }
      })
    );
  }

  getSingleSelectOptions(
    inputValue: string,
    listboxValue: string
  ): { displayName: string; id: string }[] {
    const selected = this.options.filter((x) => listboxValue.includes(x.id));
    return this.options.filter((option) => {
      if (selected.length && inputValue === selected[0].displayName) {
        return listboxValue.includes(option.displayName);
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  getMultiSelectOptions(
    inputValue: string
  ): { displayName: string; id: string }[] {
    return this.options.filter((option) => {
      if (inputValue === '') {
        return true;
      } else {
        return this.optionIncludesSearchText(option, inputValue);
      }
    });
  }

  optionIncludesSearchText(
    option: { displayName: string; id: string },
    value: string
  ): boolean {
    return option.displayName.toLowerCase().includes(value?.toLowerCase());
  }
}

[true, false].forEach((useFormControls) => {
  describe(`Basic editable textbox features - single select with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
    beforeEach(() => {
      if (useFormControls) {
        cy.mount(EditableTextboxFormControlTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
          },
        });
      } else {
        cy.mount(EditableTextboxTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
          },
        });
      }
    });
    it('displays the placeholder text', () => {
      cy.get('.textbox').should(
        'have.attr',
        'placeholder',
        'Select a fruit, A-E'
      );
    });
    it('displays the typed text in the textbox and correctly outputs typed text', () => {
      cy.get('.editable-textbox-input').type('bananas');
      cy.get('.editable-textbox-input').should('have.value', 'bananas');
      cy.get('.textbox-value').should('have.text', 'bananas');
    });
    it('displays the filtered options in the listbox - type coco', () => {
      cy.get('.textbox').type('coco');
      cy.get('.listbox').find('.listbox-option').should('have.length', 1);
    });
    it('displays the filtered options in the listbox - type a', () => {
      cy.get('.textbox').type('a');
      cy.get('.listbox').find('.listbox-option').should('have.length', 3); //Apples, Bananas, Durians
    });
    it('displays the selected value in the textbox input when an option is clicked and only one option is in the listbox', () => {
      cy.get('.editable-textbox-input').click();
      cy.get('.listbox').find('.listbox-option').eq(2).realClick();
      cy.get('.editable-textbox-input').should('have.value', 'Coconuts');
      cy.get('.editable-textbox-input').realClick();
      cy.get('.listbox-option').should('have.length', 1);
    });
  });
});

[true, false].forEach((useFormControls) => {
  describe(`Basic editable textbox features - multi select with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
    beforeEach(() => {
      if (useFormControls) {
        cy.mount(EditableTextboxFormControlTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
            isMultiSelect: true,
          },
        });
      } else {
        cy.mount(EditableTextboxTestComponent, {
          componentProperties: {
            autoSelect: true,
            autoSelectTrigger: 'any',
            isMultiSelect: true,
          },
        });
      }
    });
    // see behavior here: https://ariakit.org/examples/combobox-multiple
    it('displays the nothing in the textbox input when an option is clicked and filtering is removed', () => {
      cy.get('.editable-textbox-input').click();
      cy.get('.listbox-option').eq(2).realClick();
      cy.get('.editable-textbox-input').should('have.value', '');
      cy.get('.listbox-option').eq(3).realClick();
      cy.get('.editable-textbox-input').should('have.value', '');
      cy.get('.editable-textbox-input').click();
      cy.get('.listbox-option').should('have.length', 5);
    });
  });
});

[true, false].forEach((isMultiSelect) => {
  describe(`${isMultiSelect ? 'Multi' : 'Single'}-select combobox features - autoSelect of option`, () => {
    [true, false].forEach((useFormControls) => {
      describe(`when autoSelect is true and autoSelectTrigger is any - with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
        beforeEach(() => {
          if (useFormControls) {
            cy.mount(EditableTextboxFormControlTestComponent, {
              componentProperties: {
                autoSelect: true,
                autoSelectTrigger: 'any',
                isMultiSelect: isMultiSelect,
              },
            });
          } else {
            cy.mount(EditableTextboxTestComponent, {
              componentProperties: {
                autoSelect: true,
                autoSelectTrigger: 'any',
                isMultiSelect: isMultiSelect,
              },
            });
          }
        });
        it('selects the first item if textbox is clicked on and closed', () => {
          cy.get('.fruits-dropdown').find('input').click();
          cy.get('.listbox').should('be.visible');
          cy.get('.outside-element').realClick();
          cy.get('.combobox-value').should('have.text', 'Apples');
          cy.get('.listbox').should('not.be.visible');
          // reopen listbox and make sure properties are correct
          cy.get('.fruits-dropdown').find('input').click();
          cy.get('.listbox').should('be.visible');
          const expectedOptions = isMultiSelect ? 5 : 1;
          cy.get('.listbox-option').should('have.length', expectedOptions);
          cy.get('.listbox-option').first().should('have.class', 'selected');
          cy.get('.listbox-option').first().should('have.class', 'current');
        });
        it('retains the user selection if the listbox is closed and then reopened', () => {
          cy.get('.fruits-dropdown').find('input').click();
          cy.get('.listbox').should('be.visible');
          cy.get('.listbox').find('.listbox-option').eq(2).realClick();
          cy.get('.combobox-value').should('have.text', 'Coconuts');
          cy.get('.outside-element').realClick();
          cy.get('.listbox').should('not.be.visible');
          // reopen listbox and make sure properties are correct
          cy.get('.fruits-dropdown').find('input').click();
          cy.get('.listbox').should('be.visible');
          const expectedOptions = isMultiSelect ? 5 : 1;
          cy.get('.listbox-option').should('have.length', expectedOptions);
          const selectedIndex = isMultiSelect ? 2 : 0;
          cy.get('.listbox-option')
            .eq(selectedIndex)
            .should('have.class', 'selected');
        });
      });
      [true, false].forEach((useFormControls) => {
        describe(`when autoSelect is true and autoSelectTrigger is character - with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
          beforeEach(() => {
            if (useFormControls) {
              cy.mount(EditableTextboxFormControlTestComponent, {
                componentProperties: {
                  autoSelect: true,
                  autoSelectTrigger: 'character',
                  isMultiSelect: isMultiSelect,
                },
              });
            } else {
              cy.mount(EditableTextboxTestComponent, {
                componentProperties: {
                  autoSelect: true,
                  autoSelectTrigger: 'character',
                  isMultiSelect: isMultiSelect,
                },
              });
            }
          });
          it('does not make a selection if textbox is clicked on and closed', () => {
            cy.get('.fruits-dropdown').find('input').click();
            cy.get('.listbox').should('be.visible');
            cy.get('.outside-element').realClick();
            cy.get('.combobox-value').should('have.text', '');
            cy.get('.listbox').should('not.be.visible');
          });
          it('filters the options and selects the first in the filtered list if text is entered in the textbox but no option is clicked', () => {
            cy.get('.fruits-dropdown').find('input').type('a');
            cy.get('.listbox').should('be.visible');
            cy.get('.outside-element').realClick();
            cy.get('.combobox-value').should('have.text', 'Apples');
            cy.get('.listbox').should('not.be.visible');
            // reopen listbox and make sure properties are correct
            cy.get('.fruits-dropdown').find('input').click();
            const expectedOptions = isMultiSelect ? 5 : 1;
            cy.get('.listbox-option').should('have.length', expectedOptions);
            cy.get('.listbox-option')
              .first()
              .should('have.class', 'selected')
              .and('have.class', 'current');
          });
          it('retains the user selection if the listbox is closed and then reopened', () => {
            cy.get('.fruits-dropdown').find('input').type('a');
            cy.get('.listbox').should('be.visible');
            cy.get('.listbox').find('.listbox-option').eq(2).realClick();
            cy.get('.combobox-value').should('have.text', 'Durians');
            cy.get('.outside-element').realClick();
            cy.get('.listbox').should('not.be.visible');
            // reopen listbox and make sure properties are correct
            cy.get('.fruits-dropdown').find('input').click();
            cy.get('.listbox').should('be.visible');
            const expectedOptions = isMultiSelect ? 5 : 1;
            cy.get('.listbox')
              .find('.listbox-option')
              .should('have.length', expectedOptions);
            const selectedIndex = isMultiSelect ? 2 : 0;
            cy.get('.listbox-option')
              .eq(selectedIndex)
              .should('have.class', 'selected');
          });
        });
      });

      [true, false].forEach((useFormControls) => {
        describe(`when autoSelect is false - with ${useFormControls ? 'form controls' : 'valueChanges'}`, () => {
          beforeEach(() => {
            if (useFormControls) {
              cy.mount(EditableTextboxFormControlTestComponent, {
                componentProperties: {
                  autoSelect: false,
                  autoSelectTrigger: 'any',
                  isMultiSelect: isMultiSelect,
                },
              });
            } else {
              cy.mount(EditableTextboxTestComponent, {
                componentProperties: {
                  autoSelect: false,
                  autoSelectTrigger: 'any',
                  isMultiSelect: isMultiSelect,
                },
              });
            }
          });
          it('does not make any selections if the textbox is clicked and then there is a blur event / it is closed', () => {
            cy.get('.fruits-dropdown').find('input').click();
            cy.get('.listbox').should('be.visible');
            cy.get('.outside-element').realClick();
            cy.get('.combobox-value').should('have.text', '');
            cy.get('.listbox').should('not.be.visible');
          });
        });
      });
    });
  });
});
