/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// SPECIFICATIONS
// - If the user clicks on the select all button and it is not selected, all options are selected. If an option is disabled, its status does not change.
// - If a user clicks on the select all button and it is selected, all options are deselected. If an option is disabled, its status does not change.
// - If a user changes the selected status of an option through clicking, the select all button updates accordingly.
// - If the @Input selected property on an option changes, and the select all button was selected beforehand (i.e. option was deselected), the select all button should no longer be selected
// - If the @Input selected property on an option changes, and after the selection all options are selected (option was selected), the select all button should be selected
// - If the @Input selected property of the select all button changes and the the select all button was previously selected, all options should be unselected. In an option is disabled, its status does not change.
// - The combobox should only emit a value when the user manually selects an option.
// - No selection, deselection, or value emission should occur on disabling or enabling an option. (This is a property of ListboxOption in general, not specific to select-all, but just to clarify)

@Component({
  selector: 'app-combobox-select-all-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox
        [dynamicLabel]="dynamicLabel"
        [countSelectedLabel]="countSelectedLabel"
      >
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-select-all-listbox-option
          >Select all</app-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxSelectAllMultiSelectTestComponent extends ComboboxBaseTestComponent {
  @Input() dynamicLabel = false;
  @Input() countSelectedLabel = { singular: 'fruit', plural: 'fruits' };
}

describe('ComboboxSelectAllMultiComponent', () => {
  describe('toggling the select all / options with a click', () => {
    beforeEach(() => {
      cy.mount(ComboboxSelectAllMultiSelectTestComponent, {
        componentProperties: { dynamicLabel: true },
      });
    });
    it('correctly selects and deselects options when toggled', () => {
      cy.get('.textbox').click();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).should('not.have.class', 'selected');
      });
      // toggle on select all button, expect all options to be selected
      cy.get('.listbox-option').eq(0).realClick();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).should('have.class', 'selected');
      });
      // toggle off select all button, expect all options to not be selected
      cy.get('.listbox-option').eq(0).realClick();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).should('not.have.class', 'selected');
      });
    });

    it('reponds to user selection and deselection of other options', () => {
      cy.get('.textbox').click();
      [1, 2, 3, 4, 5].forEach((i) => {
        cy.get('.listbox-option').eq(i).realClick();
      });
      cy.get('.listbox-option').eq(0).should('have.class', 'selected');
      cy.get('.listbox-option').eq(2).realClick();
      cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');
    });
  });
});

@Component({
  selector: 'app-combobox-external-selected',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    @for (index of [0, 1, 2, 3, 4]; track index) {
      <button (click)="addToSelected(index)" class="select-option-button"
        >Select option with {{ index }} index</button
      >
      <button (click)="removeFromSelected(index)" class="deselect-option-button"
        >Deselect option with {{ index }} index</button
      >
    }
    <button (click)="clearValue()" class="clear-value-button"
      >Clear value</button
    >
    <p class="emitted-combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [dynamicLabel]="dynamicLabel">
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-select-all-listbox-option
          >Select all</app-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <app-listbox-option
            [selected]="(selected$ | async).includes(option.displayName)"
            >{{ option.displayName }}</app-listbox-option
          >
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxExternalSelectedTestComponent {
  @Input() dynamicLabel = false;
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  selected = new BehaviorSubject<string[]>([]);
  selected$ = this.selected.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(values: string[]): void {
    this.value.next(values);
    this.selected.next(values);
  }

  addToSelected(i: number) {
    const currSelected = this.selected.value.filter(
      (v) => v !== this.options[i].displayName
    );
    this.selected.next([...currSelected, this.options[i].displayName]);
  }

  removeFromSelected(i: number) {
    const currSelected = this.selected.value.filter(
      (v) => v !== this.options[i].displayName
    );
    this.selected.next(currSelected);
  }

  clearValue() {
    this.value.next([]);
  }
}

describe('ComboboxExternalSelectedTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalSelectedTestComponent, {
      componentProperties: { dynamicLabel: true },
    });
  });

  it('the select all option should respond to the selected property of an option being changed from outside - deselection', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.deselect-option-button').eq(0).realClick();
    cy.get('.listbox-option').eq(0).should('not.have.class', 'selected');
  });

  it('the select all option should respond to the selected property of an option being changed from outside - selection', () => {
    cy.get('.textbox').click();
    [1, 2, 3, 4].forEach((i) => {
      cy.get('.listbox-option').eq(i).realClick();
    });
    cy.get('.select-option-button').eq(4).realClick();
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');
  });

  it('the combobox should not emit a new value when an option is selected from outside and should emit a new value on user selection', () => {
    cy.get('.textbox').click();
    [1, 2, 3, 4].forEach((i) => {
      cy.get('.listbox-option').eq(i).realClick();
    });
    cy.get('.clear-value-button').realClick();
    cy.get('.emitted-combobox-value').should('have.text', '');
    cy.get('.select-option-button').eq(4).realClick();
    cy.get('.emitted-combobox-value').should('have.text', '');
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Durians,Elderberries'
    );
  });

  // Cypress is not able to execute the click on the clear all button in any test that follows the one above
  // The test below is what we should use here, but even if I duplicate the test above in this block, it will pass in the first instance and fail in the second
  // it('the combobox should not emit a new value when an option is deselected from outside and should emit a new value on user selection', () => {
  //   cy.get('.textbox').click();
  //   cy.get('.listbox-option').eq(0).realClick();
  //   cy.wait(500);
  //   cy.get('.clear-value-button').realClick();
  //   cy.get('.emitted-combobox-value').should('have.text', '');
  //   cy.get('.deselect-option-button').eq(0).realClick();
  //   cy.get('.emitted-combobox-value').should('have.text', '');
  //   cy.get('.textbox').click();
  //   cy.get('.listbox-option').eq(2).realClick();
  //   cy.get('.emitted-combobox-value').should(
  //     'have.text',
  //     'Coconuts,Durians,Elderberries'
  //   );
  // });
});

@Component({
  selector: 'app-combobox-external-disable',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <button (click)="addAppleToDisabled()" class="disable-apple-button"
      >Disable apple</button
    >
    <button (click)="removeAppleFromSelected()" class="enable-apple-button"
      >Enable apple</button
    >
    <p class="emitted-combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [dynamicLabel]="dynamicLabel">
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-select-all-listbox-option
          >Select all</app-select-all-listbox-option
        >
        @for (option of options; track option.id) {
          <app-listbox-option
            [disabled]="(disabled$ | async).includes(option.displayName)"
            >{{ option.displayName }}</app-listbox-option
          >
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxExternalDisableTestComponent {
  @Input() dynamicLabel = false;
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  disabled = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  value = new BehaviorSubject<string[]>([]);
  value$ = this.value.asObservable();

  onSelection(values: string[]): void {
    this.value.next(values);
  }

  addAppleToDisabled() {
    const currentDisabled = this.disabled.value.filter((x) => x !== 'Apples');
    this.disabled.next([...currentDisabled, 'Apples']);
  }

  removeAppleFromDisabled() {
    const currentDisabled = this.disabled.value;
    this.disabled.next(currentDisabled.filter((d) => d !== 'Apples'));
  }
}

describe('ComboboxExternalDisableTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalDisableTestComponent, {
      componentProperties: { dynamicLabel: true },
    });
  });

  it('the select all option should not change with a change to the disabled property of options from the outside', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.disable-apple-button').realClick();
    cy.get('.listbox-option').eq(1).should('have.class', 'disabled');
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');

    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(0).should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'disabled');
    cy.get('.textbox-label').should(
      'have.text',
      'Apples, Bananas, Coconuts, Durians, Elderberries'
    );
    cy.get('.emitted-combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
  });
});
